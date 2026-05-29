import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
