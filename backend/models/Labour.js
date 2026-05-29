import mongoose from 'mongoose';

export const LABOUR_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Mason',
  'Driver',
  'Mechanic',
  'AC Technician',
  'Welder',
  'House Worker',
  'Gardener',
];

const labourSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profileImage: { type: String, default: '' },
    categoryImage: { type: String, default: '' },
    aadhaarImage: { type: String, default: '' },
    phoneNumber: { type: String, required: true },
    skills: [{ type: String }],
    category: { type: String, enum: LABOUR_CATEGORIES, required: true },
    experience: { type: Number, default: 0 },
    wagePerDay: { type: Number, default: 0 },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    availability: { type: String, default: 'Available' },
    ratings: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0, min: 0 },
    earningsHistory: [
      {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        amount: { type: Number, required: true, min: 0 },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Labour = mongoose.model('Labour', labourSchema);
export default Labour;
