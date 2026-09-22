import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'aadhaarImage', maxCount: 1 },
]);

export const uploadSingle = (field) => upload.single(field);