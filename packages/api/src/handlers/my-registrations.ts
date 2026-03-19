import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { listByUser } from '../services/registration.service';
import { success, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const auth = requireAuth(event);
  if (auth.error) return auth.error;

  try {
    const registrations = await listByUser(auth.payload.userId);
    return success(registrations);
  } catch {
    return serverError();
  }
};
