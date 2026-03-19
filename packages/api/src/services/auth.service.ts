import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import type { User, CreateUserInput } from '@event-platform/shared';
import { findUserByEmail, findUserById, createUser } from '../repositories/user.repository';
import { signToken } from '../lib/jwt';
import { isValidEmail, isValidPassword } from '@event-platform/shared';

const SALT_ROUNDS = 10;

export const signUp = async (input: CreateUserInput) => {
  if (!isValidEmail(input.email))
    return { error: 'Invalid email format' };
  if (!isValidPassword(input.password))
    return { error: 'Password must be at least 8 characters' };
  if (!['organizer', 'attendee'].includes(input.role))
    return { error: 'Role must be organizer or attendee' };

  const existing = await findUserByEmail(input.email.toLowerCase().trim());
  if (existing) return { error: 'Email already registered' };

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user: User = {
    id: uuid(),
    email: input.email.toLowerCase().trim(),
    passwordHash,
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  await createUser(user);

  const token = signToken({ userId: user.id, role: user.role });
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

export const signIn = async (email: string, password: string) => {
  if (!email?.trim() || !password)
    return { error: 'Email and password required' };

  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) return { error: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return { error: 'Invalid credentials' };

  const token = signToken({ userId: user.id, role: user.role });
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

export const getMe = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) return { error: 'User not found' };
  return { id: user.id, email: user.email, role: user.role };
};
