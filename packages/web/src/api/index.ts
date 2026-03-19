import { request } from './client';
import type { Event } from '@event-platform/shared';

export const auth = {
  signUp: (email: string, password: string, role: string) =>
    request<{ token: string; user: { id: string; email: string; role: string } }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      }
    ),
  signIn: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; role: string } }>(
      '/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    ),
};

export const events = {
  list: (date?: string) =>
    request<Event[]>(`/events${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  get: (id: string) => request<Event>(`/events/${id}`),
  create: (body: Record<string, unknown>) =>
    request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Record<string, unknown>) =>
    request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (id: string) =>
    request<void>(`/events/${id}`, { method: 'DELETE' }),
};

export const myEvents = () =>
  request<Event[]>('/me/events');

export const registrations = {
  listByEvent: (eventId: string) =>
    request<Array<{ eventId: string; userId: string; user?: { id: string; email: string } }>>(
      `/events/${eventId}/registrations`
    ),
  register: (eventId: string) =>
    request<{ eventId: string; userId: string }>(
      `/events/${eventId}/register`,
      { method: 'POST' }
    ),
  unregister: (eventId: string) =>
    request<void>(`/events/${eventId}/unregister`, { method: 'DELETE' }),
};

export const myRegistrations = () =>
  request<Array<{ eventId: string; userId: string; event: Event | null }>>('/me/registrations');
