import jwt from 'jsonwebtoken';

export function signAccessToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

