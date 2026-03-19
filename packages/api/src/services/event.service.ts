import { v4 as uuid } from 'uuid';
import type { Event, CreateEventInput } from '@event-platform/shared';
import {
  createEvent,
  findEventById,
  findEventsByOrganizer,
  findAllEvents,
  updateEvent,
  deleteEvent,
} from '../repositories/event.repository';
import { sanitize } from '@event-platform/shared';

const toEventInput = (body: unknown): CreateEventInput | null => {
  const obj = body as Record<string, unknown>;
  if (
    typeof obj?.name !== 'string' ||
    typeof obj?.description !== 'string' ||
    typeof obj?.date !== 'string' ||
    typeof obj?.location !== 'string' ||
    typeof obj?.capacity !== 'number'
  )
    return null;
  if (obj.capacity < 1) return null;
  return {
    name: sanitize(obj.name),
    description: sanitize(obj.description),
    date: obj.date.trim(),
    location: sanitize(obj.location),
    capacity: Math.floor(obj.capacity),
  };
};

export const create = async (
  organizerId: string,
  body: unknown
): Promise<{ event?: Event; error?: string }> => {
  const input = toEventInput(body);
  if (!input) return { error: 'Invalid event data' };

  const event: Event = {
    id: uuid(),
    organizerId,
    name: input.name,
    description: input.description,
    date: input.date,
    location: input.location,
    capacity: input.capacity,
    createdAt: new Date().toISOString(),
  };

  await createEvent(event);
  return { event };
};

export const getById = async (id: string) => findEventById(id);

export const listByOrganizer = async (organizerId: string) =>
  findEventsByOrganizer(organizerId);

export const listAll = async (dateFilter?: string) =>
  findAllEvents(dateFilter);

export const update = async (
  id: string,
  organizerId: string,
  body: unknown
): Promise<{ event?: Event; error?: string }> => {
  const existing = await findEventById(id);
  if (!existing) return { error: 'Event not found' };
  if (existing.organizerId !== organizerId)
    return { error: 'Forbidden' };

  const obj = body as Record<string, unknown>;
  const updates: Partial<Event> = {};
  if (typeof obj.name === 'string') updates.name = sanitize(obj.name);
  if (typeof obj.description === 'string')
    updates.description = sanitize(obj.description);
  if (typeof obj.date === 'string') updates.date = obj.date.trim();
  if (typeof obj.location === 'string')
    updates.location = sanitize(obj.location);
  if (typeof obj.capacity === 'number' && obj.capacity >= 1)
    updates.capacity = Math.floor(obj.capacity);

  if (Object.keys(updates).length === 0)
    return { event: existing };

  await updateEvent(id, updates);
  return { event: { ...existing, ...updates } };
};

export const remove = async (
  id: string,
  organizerId: string
): Promise<{ error?: string }> => {
  const existing = await findEventById(id);
  if (!existing) return { error: 'Event not found' };
  if (existing.organizerId !== organizerId) return { error: 'Forbidden' };
  await deleteEvent(id);
  return {};
};
