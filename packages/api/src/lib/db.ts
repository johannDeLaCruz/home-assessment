const TABLE_MAP: Record<string, string> = {
  users: process.env.USERS_TABLE ?? '',
  events: process.env.EVENTS_TABLE ?? '',
  registrations: process.env.REGISTRATIONS_TABLE ?? '',
};

export const getTableName = (table: keyof typeof TABLE_MAP): string =>
  TABLE_MAP[table] ?? '';
