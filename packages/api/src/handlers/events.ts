import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { requireAuth } from '../lib/auth';
import { create as createEvent } from '../services/event.service';
import { listAll } from '../services/event.service';
import { success, created, badRequest, serverError } from '../lib/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'GET') {
    const date = event.queryStringParameters?.date;
    try {
      const events = await listAll(date);
      return success(events);
    } catch {
      return serverError();
    }
  }

  if (event.httpMethod === 'POST') {
    const auth = requireAuth(event);
    if (auth.error) return auth.error;

    let body: unknown;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch {
      return badRequest('Invalid JSON body');
    }

    try {
      const result = await createEvent(auth.payload.userId, body);
      if (result.error) return badRequest(result.error);
      return created(result.event);
    } catch {
      return serverError();
    }
  }

  return badRequest('Method not allowed');
};
