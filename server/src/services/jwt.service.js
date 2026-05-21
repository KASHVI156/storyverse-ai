import jwt from 'jsonwebtoken';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return process.env.JWT_SECRET;
}

export function signAccessToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

