import * as registrationRepo from '../repositories/registration.repository';
import { findEventById } from '../repositories/event.repository';
import { findUserById } from '../repositories/user.repository';
import type { Registration } from '@event-platform/shared';

export const register = async (
  eventId: string,
  userId: string
): Promise<{ registration?: Registration; error?: string }> => {
  const event = await findEventById(eventId);
  if (!event) return { error: 'Event not found' };

  const existing = await registrationRepo.getOne(eventId, userId);
  if (existing) return { error: 'Already registered' };

  const registrations = await registrationRepo.getByEventId(eventId);
  if (registrations.length >= event.capacity)
    return { error: 'Event is full' };

  const registration = await registrationRepo.create(eventId, userId);
  return { registration };
};

export const unregister = async (
  eventId: string,
  userId: string
): Promise<{ error?: string }> => {
  const existing = await registrationRepo.getOne(eventId, userId);
  if (!existing) return { error: 'Registration not found' };
  await registrationRepo.remove(eventId, userId);
  return {};
};

export const listByEvent = async (eventId: string, organizerId: string) => {
  const event = await findEventById(eventId);
  if (!event) return { error: 'Event not found', registrations: [] };
  if (event.organizerId !== organizerId)
    return { error: 'Forbidden', registrations: [] };

  const registrations = await registrationRepo.getByEventId(eventId);
  const users = await Promise.all(
    registrations.map((r: Registration) => findUserById(r.userId))
  );

  return {
    registrations: registrations.map((r: Registration, i: number) => ({
      ...r,
      user: users[i]
        ? { id: users[i]!.id, email: users[i]!.email }
        : null,
    })),
  };
};

export const listByUser = async (userId: string) => {
  const registrations = await registrationRepo.getByUserId(userId);
  const events = await Promise.all(
    registrations.map((r: Registration) => findEventById(r.eventId))
  );
  return registrations.map((r: Registration, i: number) => ({
    ...r,
    event: events[i] ?? null,
  }));
};
