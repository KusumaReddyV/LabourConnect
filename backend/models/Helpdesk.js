import mongoose from 'mongoose';

const helpdeskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'done'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const Helpdesk = mongoose.model('Helpdesk', helpdeskSchema);
export default Helpdesk;
