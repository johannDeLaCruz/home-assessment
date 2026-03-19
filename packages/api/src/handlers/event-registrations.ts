import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { listByEvent } from '../services/registration.service';
import { success, notFound, forbidden, badRequest, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return badRequest('Event ID required');

  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const result = await listByEvent(id, auth.payload.userId);
    if (result.error === 'Event not found') return notFound(result.error);
    if (result.error === 'Forbidden') return forbidden(result.error);
    return success(result.registrations);
  } catch {
    return serverError();
  }
};
