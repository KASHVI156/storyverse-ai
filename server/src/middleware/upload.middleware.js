import multer from 'multer';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!imageTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WebP, or GIF images are allowed'));
    }
    return cb(null, true);
  },
});
