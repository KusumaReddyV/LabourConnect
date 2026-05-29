import Job from '../models/Job.js';
import Labour from '../models/Labour.js';
import Client from '../models/Client.js';
import { createNotification } from '../utils/createNotification.js';
import { finalizeJobCompletion } from '../utils/earningsService.js';

const JOB_POPULATE = [
  { path: 'labourId', populate: { path: 'userId', select: 'name email' } },
  { path: 'clientId', populate: { path: 'userId', select: 'name email' } },
];

export const normalizeStatus = (status) => {
  const map = {
    pending: 'open',
    ongoing: 'in_progress',
    work_finished: 'done',
    completed: 'done',
  };
  return map[status] || status;
};

const formatJob = (job) => {
  const obj = job.toObject ? job.toObject() : { ...job };
  obj.status = normalizeStatus(obj.status);
  return obj;
};

const findPopulatedJob = (id) => Job.findById(id).populate(JOB_POPULATE);

const getClientProfile = async (userId) => Client.findOne({ userId });
const getLabourProfile = async (userId) => Labour.findOne({ userId });
const getRefId = (ref) => ref?._id?.toString() || ref?.toString();

const assertJobParticipant = async (req, job) => {
  if (req.user.role === 'admin') return true;

  if (req.user.role === 'client') {
    const client = await getClientProfile(req.user._id);
    return client && getRefId(job.clientId) === client._id.toString();
  }

  if (req.user.role === 'labour') {
    const labour = await getLabourProfile(req.user._id);
    return labour && getRefId(job.labourId) === labour._id.toString();
  }

  return false;
};

const assertAssignedWorker = async (req, job) => {
  if (req.user.role !== 'labour') {
    return { error: { status: 403, message: 'Only assigned worker can update job status' } };
  }
  const labour = await getLabourProfile(req.user._id);
  if (!labour) return { error: { status: 404, message: 'Labour profile not found' } };

  if (getRefId(job.labourId) !== labour._id.toString()) {
    return { error: { status: 403, message: 'Only assigned worker can update job status' } };
  }
  return { labour };
};

const canSendMessages = (status) => ['accepted', 'in_progress', 'done'].includes(normalizeStatus(status));

/** POST /api/jobs */
export const createJob = async (req, res) => {
  const client = await getClientProfile(req.user._id);
  if (!client) return res.status(404).json({ message: 'Client profile not found' });

  const { labourId, title, description, location, wageOffered, date, timing } = req.body;
  const labour = await Labour.findById(labourId);
  if (!labour) return res.status(404).json({ message: 'Worker not found' });

  const pay = Number(wageOffered);
  const job = await Job.create({
    clientId: client._id,
    labourId: labour._id,
    title,
    description,
    location,
    wageOffered: pay,
    amount: pay,
    date: new Date(date),
    timing,
    status: 'open',
  });

  const labourUser = await labour.populate('userId');
  await createNotification(
    labourUser.userId._id,
    'New Job',
    `New job posted: "${title}"`,
    '/labour/dashboard/requests'
  );

  const populated = await findPopulatedJob(job._id);
  res.status(201).json(formatJob(populated));
};

/** GET /api/jobs */
export const getClientJobs = async (req, res) => {
  const client = await getClientProfile(req.user._id);
  if (!client) return res.status(404).json({ message: 'Client profile not found' });

  const filter = { clientId: client._id };
  if (req.query.status) filter.status = req.query.status;

  const jobs = await Job.find(filter).populate(JOB_POPULATE).sort({ createdAt: -1 });
  res.json(jobs.map(formatJob));
};

/** GET /api/admin/jobs */
export const getAdminJobs = async (_req, res) => {
  const jobs = await Job.find().populate(JOB_POPULATE).sort({ createdAt: -1 });
  res.json(jobs.map(formatJob));
};

/** PATCH /api/jobs/:id/accept */
export const acceptJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const auth = await assertAssignedWorker(req, job);
  if (auth.error) return res.status(auth.error.status).json({ message: auth.error.message });

  if (normalizeStatus(job.status) !== 'open') {
    return res.status(400).json({ message: 'Only open jobs can be accepted' });
  }

  job.status = 'accepted';
  await job.save();

  const populated = await findPopulatedJob(job._id);
  await createNotification(
    populated.clientId.userId._id,
    'Job Accepted',
    `Your job "${job.title}" was accepted.`,
    '/client/dashboard/jobs'
  );
  res.json(formatJob(populated));
};

/** PATCH /api/jobs/:id/start */
export const startJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const auth = await assertAssignedWorker(req, job);
  if (auth.error) return res.status(auth.error.status).json({ message: auth.error.message });

  if (normalizeStatus(job.status) === 'done') {
    return res.status(400).json({ message: 'Cannot change a completed job' });
  }
  if (normalizeStatus(job.status) !== 'accepted') {
    return res.status(400).json({ message: 'Job must be accepted before starting' });
  }

  job.status = 'in_progress';
  await job.save();
  res.json(formatJob(await findPopulatedJob(job._id)));
};

const handleJobCompletion = async (req, res, jobId) => {
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const auth = await assertAssignedWorker(req, job);
  if (auth.error) return res.status(auth.error.status).json({ message: auth.error.message });

  try {
    const updatedJob = await finalizeJobCompletion(jobId, { labourId: auth.labour._id });
    const populated = await findPopulatedJob(updatedJob._id);
    await createNotification(
      populated.clientId.userId._id,
      'Job Completed',
      `Worker marked "${updatedJob.title}" as completed.`,
      '/client/dashboard/jobs'
    );
    return res.json({
      message: 'Job completed successfully',
      job: formatJob(populated),
      amountCredited: populated.amount ?? populated.wageOffered,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Failed to complete job' });
  }
};

/** PUT /api/jobs/complete/:jobId */
export const completeJobById = (req, res) => handleJobCompletion(req, res, req.params.jobId);

/** PATCH /api/jobs/:id/complete */
export const completeJob = (req, res) => handleJobCompletion(req, res, req.params.id);

/** POST /api/jobs/:id/message */
export const sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: 'Message is required' });

  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const allowed = await assertJobParticipant(req, job);
  if (!allowed) return res.status(403).json({ message: 'Not authorized' });

  if (!canSendMessages(job.status)) {
    return res.status(400).json({ message: 'Messages are available after the job is accepted' });
  }

  const senderRole = req.user.role === 'client' ? 'client' : 'worker';
  const entry = {
    senderId: req.user._id,
    senderRole,
    message: message.trim(),
    timestamp: new Date(),
  };
  job.messages.push(entry);
  await job.save();
  res.status(201).json(entry);
};

/** GET /api/jobs/:id/messages */
export const getMessages = async (req, res) => {
  const job = await Job.findById(req.params.id)
    .select('messages clientId labourId status')
    .populate('messages.senderId', 'name');
  if (!job) return res.status(404).json({ message: 'Job not found' });

  const allowed = await assertJobParticipant(req, job);
  if (!allowed && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(job.messages);
};

/** Legacy */
export const getOngoingJobs = async (req, res) => {
  let filter = { status: { $in: ['in_progress', 'ongoing'] } };
  if (req.user.role === 'labour') {
    const labour = await getLabourProfile(req.user._id);
    filter.labourId = labour._id;
  } else if (req.user.role === 'client') {
    const client = await getClientProfile(req.user._id);
    filter.clientId = client._id;
  }
  const jobs = await Job.find(filter).populate(JOB_POPULATE);
  res.json(jobs.map(formatJob));
};
