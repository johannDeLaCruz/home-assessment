export type UserRole = 'organizer' | 'attendee';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

export interface CreateEventInput {
  name: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
}
