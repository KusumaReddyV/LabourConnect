import Job from '../models/Job.js';
import Labour from '../models/Labour.js';
import { syncLabourCompletedCount } from './labourStats.js';

export const COMPLETED_STATUSES = ['done', 'completed'];

export const getJobAmount = (job) => {
  const amount = Number(job?.amount ?? job?.wageOffered ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

export const isJobCompleted = (status) => COMPLETED_STATUSES.includes(status);

/**
 * Mark job completed and credit assigned labour (atomic, no double credit).
 * @returns {Promise<import('mongoose').Document>} updated job
 */
export const finalizeJobCompletion = async (jobId, { labourId } = {}) => {
  const job = await Job.findById(jobId);
  if (!job) {
    const err = new Error('Job not found');
    err.status = 404;
    throw err;
  }

  if (labourId && job.labourId.toString() !== labourId.toString()) {
    const err = new Error('Only the assigned worker can complete this job');
    err.status = 403;
    throw err;
  }

  if (isJobCompleted(job.status) || job.earningsCredited) {
    const err = new Error('Job is already completed');
    err.status = 400;
    throw err;
  }

  const inProgressStatuses = ['in_progress', 'ongoing'];
  if (!inProgressStatuses.includes(job.status)) {
    const err = new Error('Job must be in progress to mark as completed');
    err.status = 400;
    throw err;
  }

  const amount = getJobAmount(job);
  if (amount <= 0) {
    const err = new Error('Job amount is invalid');
    err.status = 400;
    throw err;
  }

  const completedAt = new Date();

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      labourId: job.labourId,
      status: { $in: inProgressStatuses },
      earningsCredited: { $ne: true },
    },
    {
      $set: {
        status: 'completed',
        completedAt,
        earningsCredited: true,
        amount,
        wageOffered: job.wageOffered ?? amount,
      },
    },
    { new: true }
  );

  if (!updatedJob) {
    const current = await Job.findById(jobId);
    if (current && (isJobCompleted(current.status) || current.earningsCredited)) {
      const err = new Error('Job is already completed');
      err.status = 400;
      throw err;
    }
    const err = new Error('Job cannot be completed');
    err.status = 400;
    throw err;
  }

  await Labour.findByIdAndUpdate(updatedJob.labourId, {
    $inc: { totalEarnings: amount },
    $push: {
      earningsHistory: {
        jobId: updatedJob._id,
        amount,
        completedAt,
      },
    },
  });

  await syncLabourCompletedCount(updatedJob.labourId);

  return updatedJob;
};
