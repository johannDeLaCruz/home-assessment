import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { listByOrganizer } from '../services/event.service';
import { success, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const events = await listByOrganizer(auth.payload.userId);
    return success(events);
  } catch {
    return serverError();
  }
};
