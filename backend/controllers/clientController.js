import Client from '../models/Client.js';
import Labour from '../models/Labour.js';
import Job from '../models/Job.js';
import { createNotification } from '../utils/createNotification.js';
import Review from '../models/Review.js';
import { recalculateLabourRatings, syncLabourCompletedCount } from '../utils/labourStats.js';

export const getMyProfile = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email'
  );
  if (!client) return res.status(404).json({ message: 'Client profile not found' });
  res.json(client);
};

export const updateProfile = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  if (!client) return res.status(404).json({ message: 'Client profile not found' });

  ['phoneNumber', 'companyName', 'address'].forEach((field) => {
    if (req.body[field] !== undefined) client[field] = req.body[field];
  });
  if (req.body.requiredServices !== undefined) {
    client.requiredServices = Array.isArray(req.body.requiredServices)
      ? req.body.requiredServices
      : req.body.requiredServices.split(',').map((s) => s.trim()).filter(Boolean);
  }
  await client.save();
  res.json(client);
};

export const hireLabour = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  if (!client) return res.status(404).json({ message: 'Client profile not found' });

  const { labourId, title, description, location, wageOffered, date, timing } = req.body;
  const labour = await Labour.findById(labourId);
  if (!labour) return res.status(404).json({ message: 'Labour not found' });

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
    'New Job Request',
    `You have a new job request: "${title}"`,
    '/labour/dashboard'
  );

  const populated = await Job.findById(job._id)
    .populate('labourId')
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } });

  res.status(201).json(populated);
};

export const getMyJobs = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const filter = { clientId: client._id };
  if (req.query.status) filter.status = req.query.status;

  const jobs = await Job.find(filter)
    .populate('labourId')
    .populate({ path: 'labourId', populate: { path: 'userId', select: 'name' } })
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json(jobs);
};

export const markJobOngoing = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const job = await Job.findOne({ _id: req.params.id, clientId: client._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'accepted') {
    return res.status(400).json({ message: 'Job must be accepted first' });
  }
  job.status = 'ongoing';
  await job.save();
  res.json(job);
};

export const toggleFavourite = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const labourId = req.params.labourId;
  const idx = client.favourites.findIndex((id) => id.toString() === labourId);
  if (idx >= 0) client.favourites.splice(idx, 1);
  else client.favourites.push(labourId);
  await client.save();
  const favourites = await Labour.find({ _id: { $in: client.favourites } }).populate(
    'userId',
    'name'
  );
  res.json({ favourites });
};

export const getFavourites = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const favourites = await Labour.find({ _id: { $in: client.favourites } }).populate(
    'userId',
    'name email'
  );
  res.json(favourites);
};

/** Client verifies work, rates worker, updates payment status */
export const confirmJobComplete = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const job = await Job.findOne({ _id: req.params.id, clientId: client._id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'work_finished') {
    return res.status(400).json({ message: 'Worker must mark work as finished first' });
  }

  const { rating, review, paymentStatus } = req.body;
  const ratingNum = Number(rating);
  if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating between 1 and 5 is required' });
  }

  job.status = 'completed';
  job.completedAt = new Date();
  job.paymentStatus = ['pending', 'verified', 'paid'].includes(paymentStatus)
    ? paymentStatus
    : 'paid';
  await job.save();

  const existingReview = await Review.findOne({ jobId: job._id });
  if (!existingReview) {
    await Review.create({
      clientId: client._id,
      labourId: job.labourId,
      jobId: job._id,
      rating: ratingNum,
      review: review || '',
    });
  }

  await syncLabourCompletedCount(job.labourId);
  await recalculateLabourRatings(job.labourId);

  const labour = await Labour.findById(job.labourId).populate('userId');
  if (labour?.userId) {
    await createNotification(
      labour.userId._id,
      'Job Completed',
      `Client confirmed "${job.title}". Your profile stats have been updated.`,
      '/labour/dashboard'
    );
  }

  const populated = await Job.findById(job._id)
    .populate('labourId')
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } });

  res.json(populated);
};

export const getPendingVerifications = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const jobs = await Job.find({ clientId: client._id, status: 'work_finished' })
    .populate('labourId')
    .populate({ path: 'labourId', populate: { path: 'userId', select: 'name' } })
    .sort({ workFinishedAt: -1 });
  res.json(jobs);
};
