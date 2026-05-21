import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads/profile-images');

function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function uploadToCloudinary(file) {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'storyverse/profiles',
        resource_type: 'image',
        transformation: [{ width: 512, height: 512, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id, storage: 'cloudinary' });
      }
    );

    stream.end(file.buffer);
  });
}

async function saveLocalImage(file) {
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = file.mimetype.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const diskPath = path.join(uploadsDir, filename);
  await fs.writeFile(diskPath, file.buffer);

  return {
    url: `/uploads/profile-images/${filename}`,
    publicId: filename,
    storage: 'local',
  };
}

export async function saveProfileImage(file) {
  if (!file) {
    const err = new Error('Profile image is required');
    err.statusCode = 400;
    throw err;
  }

  if (isCloudinaryConfigured()) return uploadToCloudinary(file);
  return saveLocalImage(file);
}
