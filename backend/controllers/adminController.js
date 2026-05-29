import User from '../models/User.js';
import Job from '../models/Job.js';
import Labour from '../models/Labour.js';
import Client from '../models/Client.js';
import Review from '../models/Review.js';

export const getAllUsers = async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Cannot delete admin account' });
  }
  if (user.role === 'labour') await Labour.deleteOne({ userId: user._id });
  if (user.role === 'client') await Client.deleteOne({ userId: user._id });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

export const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Cannot block admin' });
  }
  user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : !user.isBlocked;
  await user.save();
  res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', user });
};

export const getAnalytics = async (_req, res) => {
  const [totalUsers, totalLabour, totalClients, totalJobs, pendingJobs, completedJobs, totalReviews] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'labour' }),
      User.countDocuments({ role: 'client' }),
      Job.countDocuments(),
      Job.countDocuments({ status: { $in: ['open', 'pending'] } }),
      Job.countDocuments({ status: { $in: ['done', 'completed'] } }),
      Review.countDocuments(),
    ]);

  const jobsByStatus = await Job.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    totalUsers,
    totalLabour,
    totalClients,
    totalJobs,
    pendingJobs,
    completedJobs,
    totalReviews,
    jobsByStatus,
  });
};
