import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { UserRole } from '@event-platform/shared';
import { signUp, signIn } from '../services/auth.service';
import { success, badRequest, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const action = event.pathParameters?.action;
  if (!action || !['signup', 'signin'].includes(action)) {
    return badRequest('Invalid action');
  }

  let body: Record<string, unknown> = {};
  try {
    body = event.body ? (JSON.parse(event.body) as Record<string, unknown>) : {};
  } catch {
    return badRequest('Invalid JSON body');
  }

  const email = body.email as string;
  const password = body.password as string;
  const role = body.role as string;

  try {
    if (action === 'signup') {
      const roleVal: UserRole = role && ['organizer', 'attendee'].includes(role) ? (role as UserRole) : 'attendee';
      const result = await signUp({ email, password, role: roleVal });
      if (result.error) return badRequest(result.error);
      return success(result);
    }

    const result = await signIn(email, password);
    if (result.error) return badRequest(result.error);
    return success(result);
  } catch (err) {
    console.error('Auth error:', err);
    return serverError();
  }
};
