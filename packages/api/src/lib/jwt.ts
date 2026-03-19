import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';
const EXPIRES_IN = '7d';

export const signToken = (payload: { userId: string; role: string }) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string; role: string };
    return decoded;
  } catch {
    return null;
  }
};
