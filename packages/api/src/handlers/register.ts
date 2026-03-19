import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { register } from '../services/registration.service';
import {
  created,
  badRequest,
  notFound,
  conflict,
  serverError,
} from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return badRequest('Event ID required');

  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const result = await register(id, auth.payload.userId);
    if (result.error) {
      if (result.error === 'Event not found') return notFound(result.error);
      if (result.error === 'Already registered') return conflict(result.error);
      if (result.error === 'Event is full') return conflict(result.error);
      return badRequest(result.error);
    }
    return created(result.registration);
  } catch {
    return serverError();
  }
};
