import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { unregister } from '../services/registration.service';
import { noContent, notFound, badRequest, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return badRequest('Event ID required');

  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const result = await unregister(id, auth.payload.userId);
    if (result.error) {
      if (result.error === 'Registration not found')
        return notFound(result.error);
      return badRequest(result.error);
    }
    return noContent();
  } catch {
    return serverError();
  }
};
