import Review from '../models/Review.js';
import Labour from '../models/Labour.js';
import Client from '../models/Client.js';
import Job from '../models/Job.js';

export const createReview = async (req, res) => {
  const client = await Client.findOne({ userId: req.user._id });
  const { labourId, jobId, rating, review } = req.body;

  const labour = await Labour.findById(labourId);
  if (!labour) return res.status(404).json({ message: 'Labour not found' });

  if (jobId) {
    const job = await Job.findOne({
      _id: jobId,
      clientId: client._id,
      labourId,
      status: 'completed',
    });
    if (!job) return res.status(400).json({ message: 'Completed job required to review' });
  }

  const newReview = await Review.create({
    clientId: client._id,
    labourId,
    jobId: jobId || undefined,
    rating: Number(rating),
    review: review || '',
  });

  const allReviews = await Review.find({ labourId });
  const avg =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
  labour.ratings = Math.round(avg * 10) / 10;
  labour.ratingCount = allReviews.length;
  await labour.save();

  res.status(201).json(newReview);
};

export const getLabourReviews = async (req, res) => {
  const reviews = await Review.find({ labourId: req.params.labourId })
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json(reviews);
};

export const getAllReviews = async (_req, res) => {
  const reviews = await Review.find()
    .populate({ path: 'labourId', populate: { path: 'userId', select: 'name' } })
    .populate({ path: 'clientId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(reviews);
};
