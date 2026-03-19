export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export const jsonResponse = (
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {}
) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...corsHeaders, ...headers },
  body: JSON.stringify(body),
});

export const success = (body: unknown) => jsonResponse(200, body);
export const created = (body: unknown) => jsonResponse(201, body);
export const noContent = () => jsonResponse(204, {});
export const badRequest = (message: string) =>
  jsonResponse(400, { error: message });
export const unauthorized = (message = 'Unauthorized') =>
  jsonResponse(401, { error: message });
export const forbidden = (message = 'Forbidden') =>
  jsonResponse(403, { error: message });
export const notFound = (message = 'Not found') =>
  jsonResponse(404, { error: message });
export const conflict = (message: string) =>
  jsonResponse(409, { error: message });
export const serverError = (message = 'Internal server error') =>
  jsonResponse(500, { error: message });
