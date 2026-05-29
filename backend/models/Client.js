import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, default: '' },
    address: { type: String, default: '' },
    requiredServices: [{ type: String }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Labour' }],
  },
  { timestamps: true }
);

const Client = mongoose.model('Client', clientSchema);
export default Client;
