import User from '../models/User.js';
import Labour from '../models/Labour.js';
import Client from '../models/Client.js';
import generateToken from '../utils/generateToken.js';
import { getCategoryImage } from '../utils/categoryImages.js';
import { normalizeEmail, normalizeRole, roleDisplayName } from '../utils/authHelpers.js';
import { uploadBufferToCloudinary } from '../utils/uploadToCloudinary.js';

const buildAuthResponse = (user) => {
  const role = normalizeRole(user.role);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
    token: generateToken(user._id, role),
  };
};

export const registerLabour = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    skills,
    category,
    experience,
    wagePerDay,
    location,
    description,
    availability,
  } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name: fullName,
    email,
    password,
    role: 'labour',
  });

 let profileImage = '';
let aadhaarImage = '';

const profileFile = req.files?.profileImage?.[0];
const aadhaarFile = req.files?.aadhaarImage?.[0];

if (profileFile) {
  const result = await uploadBufferToCloudinary(profileFile.buffer, {
    folder: 'labourconnect/profile-images',
    resource_type: 'image',
  });

  profileImage = result.secure_url;
}

if (aadhaarFile) {
  const result = await uploadBufferToCloudinary(aadhaarFile.buffer, {
    folder: 'labourconnect/aadhaar-images',
    resource_type: 'image',
  });

  aadhaarImage = result.secure_url;
}

  const skillsList = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const labour = await Labour.create({
    userId: user._id,
    profileImage,
    categoryImage: getCategoryImage(category),
    aadhaarImage,
    phoneNumber,
    skills: skillsList,
    category,
    experience: Number(experience) || 0,
    wagePerDay: Number(wagePerDay) || 0,
    location,
    description: description || '',
    availability: availability || 'Available',
  });

  res.status(201).json({
    ...buildAuthResponse(user),
    labourId: labour._id,
  });
};

export const registerClient = async (req, res) => {
  const { fullName, email, password, phoneNumber, companyName, address, requiredServices } =
    req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name: fullName,
    email,
    password,
    role: 'client',
  });

  const servicesList = Array.isArray(requiredServices)
    ? requiredServices
    : typeof requiredServices === 'string'
      ? requiredServices.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const client = await Client.create({
    userId: user._id,
    phoneNumber,
    companyName: companyName || '',
    address: address || '',
    requiredServices: servicesList,
  });

  res.status(201).json({
    ...buildAuthResponse(user),
    clientId: client._id,
  });
};

export const login = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;
  const requestedRole = req.body.role ? normalizeRole(req.body.role) : null;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  let user = await User.findOne({ email });
  if (!user) {
    const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    user = await User.findOne({ email: { $regex: new RegExp(`^${escaped}$`, 'i') } });
  }
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const userRole = normalizeRole(user.role);
  if (!['labour', 'client', 'admin'].includes(userRole)) {
    return res.status(403).json({
      message: 'This account has an unrecognized role. Please contact support.',
    });
  }

  if (
    requestedRole &&
    userRole !== 'admin' &&
    requestedRole !== 'admin' &&
    requestedRole !== userRole
  ) {
    const hint =
      userRole === 'labour'
        ? 'Worker'
        : userRole === 'client'
          ? 'Client'
          : roleDisplayName(userRole);
    return res.status(401).json({
      message: `This account is registered as a ${roleDisplayName(userRole)}. Please select "${hint}" and try again.`,
    });
  }

  if (!(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: 'Your account has been blocked. Contact support for help.' });
  }

  let profileId = null;
  if (userRole === 'labour') {
    const labour = await Labour.findOne({ userId: user._id });
    profileId = labour?._id;
  } else if (userRole === 'client') {
    const client = await Client.findOne({ userId: user._id });
    profileId = client?._id;
  }

  res.json({
    ...buildAuthResponse(user),
    profileId,
  });
};

export const getMe = async (req, res) => {
  const user = req.user;
  const role = normalizeRole(user.role);
  let profile = null;
  if (role === 'labour') {
    profile = await Labour.findOne({ userId: user._id }).populate('userId', 'name email');
  } else if (role === 'client') {
    profile = await Client.findOne({ userId: user._id }).populate('userId', 'name email');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role,
    profile,
  });
};

export const logout = async (_req, res) => {
  res.json({ message: 'Logged out successfully' });
};
