import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@labourconnect.com';
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  await User.create({
    name: process.env.ADMIN_NAME || 'Admin User',
    email,
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
  });
  console.log('Admin created:', email);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
