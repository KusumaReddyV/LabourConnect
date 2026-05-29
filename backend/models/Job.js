import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['client', 'worker'], required: true },
    message: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const jobSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    wageOffered: { type: Number, required: true },
    amount: { type: Number, required: true },
    earningsCredited: { type: Boolean, default: false },
    date: { type: Date, required: true },
    timing: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'open',
        'accepted',
        'in_progress',
        'done',
        'rejected',
        'pending',
        'ongoing',
        'work_finished',
        'completed',
      ],
      default: 'open',
    },
    messages: [messageSchema],
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'paid'],
      default: 'pending',
    },
    workFinishedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

jobSchema.pre('validate', function setAmountFromWage(next) {
  if ((this.amount == null || this.amount === undefined) && this.wageOffered != null) {
    this.amount = this.wageOffered;
  }
  if ((this.wageOffered == null || this.wageOffered === undefined) && this.amount != null) {
    this.wageOffered = this.amount;
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
