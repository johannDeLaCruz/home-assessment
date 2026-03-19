import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import {
  getById,
  update as updateEvent,
  remove as deleteEvent,
} from '../services/event.service';
import {
  success,
  noContent,
  notFound,
  forbidden,
  badRequest,
  serverError,
} from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return badRequest('Event ID required');

  if (event.httpMethod === 'GET') {
    try {
      const evt = await getById(id);
      if (!evt) return notFound('Event not found');
      return success(evt);
    } catch {
      return serverError();
    }
  }

  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  if (event.httpMethod === 'PUT') {
    let body: unknown;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      return badRequest('Invalid JSON body');
    }

    try {
      const result = await updateEvent(id, auth.payload.userId, body);
      if (result.error) {
        if (result.error === 'Event not found') return notFound(result.error);
        if (result.error === 'Forbidden') return forbidden(result.error);
        return badRequest(result.error);
      }
      return success(result.event);
    } catch {
      return serverError();
    }
  }

  if (event.httpMethod === 'DELETE') {
    try {
      const result = await deleteEvent(id, auth.payload.userId);
      if (result.error) {
        if (result.error === 'Event not found') return notFound(result.error);
        if (result.error === 'Forbidden') return forbidden(result.error);
        return badRequest(result.error);
      }
      return noContent();
    } catch {
      return serverError();
    }
  }

  return badRequest('Method not allowed');
};
