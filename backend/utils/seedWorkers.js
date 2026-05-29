import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Labour from '../models/Labour.js';
import Client from '../models/Client.js';
import Review from '../models/Review.js';
import { getCategoryImage } from './categoryImages.js';

dotenv.config();

const DEMO_PASSWORD = 'Demo@12345';
const RESET = process.argv.includes('--reset');

const DEMO_WORKERS = [
  {
    name: 'Rajesh Verma',
    email: 'rajesh.verma.electrician@gmail.com',
    phoneNumber: '9876543210',
    category: 'Electrician',
    skills: ['House wiring', 'MCB panels', 'Inverter setup', 'Fault finding'],
    experience: 9,
    wagePerDay: 1300,
    location: 'Hyderabad, Karmanghat',
    description:
      'Licensed electrician with 9 years of experience in residential and small commercial projects. Safety-first approach and neat finishing.',
    availability: 'Available',
    profileImage: 'https://i.pravatar.cc/300?img=12',
    ratings: 4.8,
    ratingCount: 32,
    completedJobs: 64,
  },
  {
    name: 'Suresh Reddy',
    email: 'suresh.reddy.plumber@gmail.com',
    phoneNumber: '9876543211',
    category: 'Plumber',
    skills: ['Leak repair', 'Bathroom fittings', 'PVC pipelines', 'Water tank'],
    experience: 7,
    wagePerDay: 1100,
    location: 'Secunderabad, Malkajgiri',
    description:
      'Reliable plumber for homes and apartments. Quick response for emergency leaks and full bathroom installations.',
    availability: 'Available',
    profileImage: 'https://i.pravatar.cc/300?img=15',
    ratings: 4.6,
    ratingCount: 28,
    completedJobs: 51,
  },
  {
    name: 'John Steve',
    email: 'john.steve.carpenter@gmail.com',
    phoneNumber: '9876543212',
    category: 'Carpenter',
    skills: ['Modular kitchen', 'Doors & windows', 'Custom furniture', 'Wood polishing'],
    experience: 11,
    wagePerDay: 1600,
    location: 'Hyderabad, Gachibowli',
    description:
      'Master carpenter specializing in precision woodwork, modular kitchens, and on-site custom furniture.',
    availability: 'Full-Time',
    profileImage: 'https://img.freepik.com/premium-photo/portrait-happy-african-american-construction-worker-looking-camera-smiling-building_114016-15193.jpg?w=2000',
    ratings: 4.9,
    ratingCount: 45,
    completedJobs: 78,
  },
  {
    name: 'Amit Sharma',
    email: 'amit.sharma.painter@gmail.com',
    phoneNumber: '9876543213',
    category: 'Painter',
    skills: ['Interior emulsion', 'Exterior weather coat', 'Texture walls', 'Waterproofing'],
    experience: 8,
    wagePerDay: 950,
    location: 'Hyderabad, Banjara Hills',
    description:
      'Professional painter delivering clean lines, even coats, and premium finish for homes and offices.',
    availability: 'Part-Time',
    profileImage: 'https://i.pravatar.cc/300?img=68',
    ratings: 4.7,
    ratingCount: 38,
    completedJobs: 69,
  },
  {
    name: 'Vijay Kumar',
    email: 'vijay.kumar.mechanic@gmail.com',
    phoneNumber: '9876543214',
    category: 'Mechanic',
    skills: ['Two-wheeler service', 'Car general service', 'Engine tune-up', 'Brake repair'],
    experience: 6,
    wagePerDay: 1200,
    location: 'Hyderabad, LB Nagar',
    description:
      'Experienced mechanic for bikes and cars. Honest diagnostics and quality spare parts.',
    availability: 'Available',
    profileImage: 'https://i.pravatar.cc/300?img=53',
    ratings: 4.5,
    ratingCount: 22,
    completedJobs: 44,
  },
  {
    name: 'Srinivas Naidu',
    email: 'srinivas.naidu.ac@gmail.com',
    phoneNumber: '9876543215',
    category: 'AC Technician',
    skills: ['Split AC install', 'Gas charging', 'Deep service', 'Duct cleaning'],
    experience: 5,
    wagePerDay: 1150,
    location: 'Hyderabad, Miyapur',
    description:
      'Certified AC technician for installation, annual maintenance, and cooling performance optimization.',
    availability: 'Available',
    profileImage: 'https://i.pravatar.cc/300?img=59',
    ratings: 4.7,
    ratingCount: 26,
    completedJobs: 52,
  },
  {
    name: 'Lakshmi Priya',
    email: 'lakshmi.priya.gardener@gmail.com',
    phoneNumber: '9876543216',
    category: 'Gardener',
    skills: ['Lawn maintenance', 'Plant care', 'Drip irrigation', 'Terrace garden'],
    experience: 4,
    wagePerDay: 800,
    location: 'Hyderabad, Jubilee Hills',
    description:
      'Dedicated gardener for residential gardens, seasonal planting, and regular maintenance schedules.',
    availability: 'Available',
    profileImage: 'https://i.pravatar.cc/300?img=47',
    ratings: 4.8,
    ratingCount: 19,
    completedJobs: 36,
  },
  {
    name: 'Mohammed Hassan',
    email: 'mohammed.hassan.mason@gmail.com',
    phoneNumber: '9876543217',
    category: 'Mason',
    skills: ['Brick masonry', 'Plastering', 'Tile laying', 'Renovation'],
    experience: 12,
    wagePerDay: 1400,
    location: 'Hyderabad, Uppal',
    description:
      'Senior mason for construction and renovation work with strong focus on structural quality.',
    availability: 'Full-Time',
    profileImage: 'https://i.pravatar.cc/300?img=33',
    ratings: 4.6,
    ratingCount: 34,
    completedJobs: 82,
  },
];

const SAMPLE_REVIEWS = [
  { rating: 5, review: 'Bahut accha kaam kiya, time par aaye aur safai se kaam complete kiya.' },
  { rating: 5, review: 'Professional and skilled. Highly recommend for home projects.' },
  { rating: 4, review: 'Good quality work, fair pricing. Will hire again.' },
];

async function clearDemoData() {
  const emails = [
    ...DEMO_WORKERS.map((w) => w.email),
    'demo.client@labourconnect.com',
    // legacy demo emails
    'demo.electrician@labourconnect.com',
    'demo.plumber@labourconnect.com',
    'demo.carpenter@labourconnect.com',
    'demo.welder@labourconnect.com',
    'demo.ac@labourconnect.com',
    'demo.painter@labourconnect.com',
  ];

  for (const email of emails) {
    const user = await User.findOne({ email });
    if (!user) continue;
    const labour = await Labour.findOne({ userId: user._id });
    if (labour) {
      await Review.deleteMany({ labourId: labour._id });
      await Labour.deleteOne({ _id: labour._id });
    }
    await Client.deleteOne({ userId: user._id });
    await User.deleteOne({ _id: user._id });
  }
  console.log('Cleared existing demo users and profiles.');
}

const seedWorkers = async () => {
  await connectDB();

  if (RESET) await clearDemoData();

  let demoClient;
  const clientUser = await User.findOne({ email: 'demo.client@labourconnect.com' });
  if (!clientUser) {
    const user = await User.create({
      name: 'Priya Constructions',
      email: 'demo.client@labourconnect.com',
      password: DEMO_PASSWORD,
      role: 'client',
    });
    demoClient = await Client.create({
      userId: user._id,
      phoneNumber: '9123456780',
      companyName: 'Priya Constructions Pvt Ltd',
      address: 'Hyderabad, Telangana',
      requiredServices: ['Electrician', 'Plumber', 'Mason'],
    });
    console.log('Created demo client: demo.client@labourconnect.com');
  } else {
    demoClient = await Client.findOne({ userId: clientUser._id });
  }

  let created = 0;
  let skipped = 0;

  for (const worker of DEMO_WORKERS) {
    const exists = await User.findOne({ email: worker.email });
    if (exists) {
      skipped++;
      continue;
    }

    const user = await User.create({
      name: worker.name,
      email: worker.email,
      password: DEMO_PASSWORD,
      role: 'labour',
    });

    const labour = await Labour.create({
      userId: user._id,
      phoneNumber: worker.phoneNumber,
      category: worker.category,
      skills: worker.skills,
      experience: worker.experience,
      wagePerDay: worker.wagePerDay,
      location: worker.location,
      description: worker.description,
      availability: worker.availability,
      profileImage: worker.profileImage,
      categoryImage: getCategoryImage(worker.category),
      ratings: worker.ratings,
      ratingCount: worker.ratingCount,
      completedJobs: worker.completedJobs,
    });

    for (const r of SAMPLE_REVIEWS.slice(0, 2)) {
      await Review.create({
        clientId: demoClient._id,
        labourId: labour._id,
        rating: r.rating,
        review: r.review,
      });
    }

    created++;
    console.log(`Created: ${worker.name} (${worker.category})`);
  }

  console.log(`\nSeed complete. Created: ${created}, Skipped: ${skipped}`);
  console.log(`Demo password (workers + client): ${DEMO_PASSWORD}`);
  console.log('Re-run with --reset to replace all demo profiles.');
  process.exit(0);
};

seedWorkers().catch((err) => {
  console.error(err);
  process.exit(1);
});
