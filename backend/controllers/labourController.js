import Labour from '../models/Labour.js';
import Job from '../models/Job.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { createNotification } from '../utils/createNotification.js';
import { getCategoryImage } from '../utils/categoryImages.js';
import { finalizeJobCompletion, COMPLETED_STATUSES } from '../utils/earningsService.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';
export const getMyProfile = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email'
  );
  if (!labour) return res.status(404).json({ message: 'Labour profile not found' });
  res.json(labour);
};

export const updateProfile = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  if (!labour) return res.status(404).json({ message: 'Labour profile not found' });

  const fields = [
    'phoneNumber',
    'skills',
    'category',
    'experience',
    'wagePerDay',
    'location',
    'description',
    'availability',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'skills' && typeof req.body.skills === 'string') {
        labour.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (field === 'experience' || field === 'wagePerDay') {
        labour[field] = Number(req.body[field]);
      } else {
        labour[field] = req.body[field];
      }
    }
  });

  if (req.body.category) labour.categoryImage = getCategoryImage(labour.category);
if (req.file) {
  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: 'labourconnect/profile-images',
    resource_type: 'image',
  });

  labour.profileImage = result.secure_url;
}
  
  if (req.body.profileImage === '') labour.profileImage = '';

  await labour.save();
  res.json(labour);
};

export const getJobRequests = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  if (!labour) return res.status(404).json({ message: 'Labour profile not found' });

  const status = req.query.status;
  const filter = { labourId: labour._id };
  if (status) filter.status = status;

  const jobs = await Job.find(filter)
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name email' } })
    .populate({ path: 'labourId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json(jobs);
};

export const acceptJob = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  const job = await Job.findOne({ _id: req.params.id, labourId: labour._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (!['open', 'pending'].includes(job.status)) {
    return res.status(400).json({ message: 'Job is not open' });
  }
  job.status = 'accepted';
  await job.save();

  await job.populate({ path: 'clientId', populate: { path: 'userId' } });
  await createNotification(
    job.clientId.userId._id,
    'Job Accepted',
    `Your job "${job.title}" was accepted.`,
    '/client/dashboard'
  );
  res.json(job);
};

export const rejectJob = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  const job = await Job.findOne({ _id: req.params.id, labourId: labour._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (!['open', 'pending'].includes(job.status)) {
    return res.status(400).json({ message: 'Job is not open' });
  }
  job.status = 'rejected';
  await job.save();
  res.json(job);
};

export const startJob = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  const job = await Job.findOne({ _id: req.params.id, labourId: labour._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'accepted') {
    return res.status(400).json({ message: 'Job must be accepted first' });
  }
  job.status = 'in_progress';
  await job.save();
  res.json(job);
};

/** Worker marks job completed (legacy route) */
export const finishWork = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  if (!labour) return res.status(404).json({ message: 'Labour profile not found' });

  try {
    const updatedJob = await finalizeJobCompletion(req.params.id, { labourId: labour._id });
    await updatedJob.populate({ path: 'clientId', populate: { path: 'userId' } });
    await createNotification(
      updatedJob.clientId.userId._id,
      'Job Completed',
      `Worker marked "${updatedJob.title}" as completed.`,
      '/client/dashboard/jobs'
    );
    res.json({
      message: 'Job completed successfully',
      job: updatedJob,
    });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Failed to complete job' });
  }
};

/** GET /api/labour/earnings/me */
export const getMyEarnings = async (req, res) => {
  req.params.labourId = 'me';
  return getLabourEarnings(req, res);
};

/** GET /api/labour/earnings/:labourId */
export const getLabourEarnings = async (req, res) => {
  const paramId = req.params.labourId;
  let labour;

  if (paramId === 'me') {
    labour = await Labour.findOne({ userId: req.user._id });
  } else if (req.user.role === 'admin') {
    labour = await Labour.findById(paramId);
  } else if (req.user.role === 'labour') {
    labour = await Labour.findOne({ userId: req.user._id });
    if (paramId && labour && paramId !== labour._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these earnings' });
    }
  } else {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (!labour) return res.status(404).json({ message: 'Labour not found' });

  const doc = await Labour.findById(labour._id)
    .select('totalEarnings earningsHistory completedJobs')
    .populate({
      path: 'earningsHistory.jobId',
      select: 'title status amount wageOffered completedAt createdAt',
    });

  const earningsHistory = [...(doc.earningsHistory || [])]
    .reverse()
    .map((entry) => ({
      jobId: entry.jobId?._id || entry.jobId,
      title: entry.jobId?.title || 'Job',
      amount: entry.amount,
      completedAt: entry.completedAt,
      status: entry.jobId?.status,
    }));

  const jobHistory = await Job.find({
    labourId: labour._id,
    status: { $in: COMPLETED_STATUSES },
  })
    .select('title amount wageOffered status completedAt createdAt')
    .sort({ completedAt: -1 })
    .limit(50);

  res.json({
    labourId: doc._id,
    totalEarnings: doc.totalEarnings ?? 0,
    completedJobsCount: doc.completedJobs ?? 0,
    earningsHistory,
    jobHistory,
  });
};

export const getCompletedJobs = async (req, res) => {
  const labour = await Labour.findOne({ userId: req.user._id });
  const jobs = await Job.find({ labourId: labour._id, status: { $in: ['done', 'completed'] } })
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } })
    .sort({ updatedAt: -1 });
  res.json(jobs);
};

export const getLabourById = async (req, res) => {
  const labour = await Labour.findById(req.params.id).populate('userId', 'name email isBlocked createdAt');
  if (!labour) return res.status(404).json({ message: 'Labour not found' });

  const user = labour.userId;
  if (user?.isBlocked) return res.status(404).json({ message: 'Labour not available' });

  const reviews = await Review.find({ labourId: labour._id })
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(20);

  const completedJobsCount = await Job.countDocuments({
    labourId: labour._id,
    status: { $in: ['done', 'completed'] },
  });

  res.json({
    ...labour.toObject(),
    reviews,
    completedJobsCount,
  });
};

export const searchLabourers = async (req, res) => {
  const { skill, category, minWage, maxWage, location, availability, minRating, page = 1, limit = 12 } =
    req.query;

  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (availability) filter.availability = { $regex: availability, $options: 'i' };
  if (skill) filter.skills = { $regex: skill, $options: 'i' };
  if (minWage || maxWage) {
    filter.wagePerDay = {};
    if (minWage) filter.wagePerDay.$gte = Number(minWage);
    if (maxWage) filter.wagePerDay.$lte = Number(maxWage);
  }
  if (minRating) filter.ratings = { $gte: Number(minRating) };

  const blockedUsers = await User.find({ isBlocked: true }).select('_id');
  const blockedIds = blockedUsers.map((u) => u._id);

  const skip = (Number(page) - 1) * Number(limit);
  const query = Labour.find({
    ...filter,
    userId: { $nin: blockedIds },
  })
    .populate('userId', 'name email')
    .sort({ ratings: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const [labourers, total] = await Promise.all([query, Labour.countDocuments({ ...filter, userId: { $nin: blockedIds } })]);

  res.json({
    labourers,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
};
