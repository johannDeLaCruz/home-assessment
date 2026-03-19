import type { APIGatewayProxyEvent } from 'aws-lambda';
import { verifyToken } from './jwt';
import { unauthorized } from './response';

export const extractBearerToken = (event: APIGatewayProxyEvent): string | null => {
  const auth = event.headers?.Authorization ?? event.headers?.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
};

export const requireAuth = (event: APIGatewayProxyEvent) => {
  const token = extractBearerToken(event);
  if (!token) return { error: unauthorized('Missing or invalid authorization') };
  const payload = verifyToken(token);
  if (!payload) return { error: unauthorized('Invalid or expired token') };
  return { payload };
};
