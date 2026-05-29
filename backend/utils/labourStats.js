import Review from '../models/Review.js';
import Labour from '../models/Labour.js';
import Job from '../models/Job.js';

export const recalculateLabourRatings = async (labourId) => {
  const reviews = await Review.find({ labourId });
  const labour = await Labour.findById(labourId);
  if (!labour) return null;

  labour.ratingCount = reviews.length;
  labour.ratings =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
  await labour.save();
  return labour;
};

export const syncLabourCompletedCount = async (labourId) => {
  const count = await Job.countDocuments({
    labourId,
    status: { $in: ['done', 'completed'] },
    earningsCredited: true,
  });
  await Labour.findByIdAndUpdate(labourId, { completedJobs: count });
  return count;
};
