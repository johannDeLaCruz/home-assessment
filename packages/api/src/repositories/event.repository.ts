import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Event } from '@event-platform/shared';
import { getTableName } from '../lib/db';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const formatEvent = (item: Record<string, unknown>): Event => ({
  id: item.id as string,
  organizerId: item.organizerId as string,
  name: item.name as string,
  description: item.description as string,
  date: item.date as string,
  location: item.location as string,
  capacity: item.capacity as number,
  createdAt: item.createdAt as string,
});

export const createEvent = async (event: Event): Promise<void> => {
  await client.send(
    new PutCommand({
      TableName: getTableName('events'),
      Item: event,
    })
  );
};

export const findEventById = async (id: string): Promise<Event | null> => {
  const result = await client.send(
    new GetCommand({
      TableName: getTableName('events'),
      Key: { id },
    })
  );

  return result.Item ? formatEvent(result.Item as Record<string, unknown>) : null;
};

export const findEventsByOrganizer = async (
  organizerId: string
): Promise<Event[]> => {
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName('events'),
      IndexName: 'organizer-index',
      KeyConditionExpression: 'organizerId = :organizerId',
      ExpressionAttributeValues: { ':organizerId': organizerId },
    })
  );

  return (result.Items ?? []).map((i) =>
    formatEvent(i as Record<string, unknown>)
  );
};

export const findAllEvents = async (dateFilter?: string): Promise<Event[]> => {
  const result = await client.send(
    new ScanCommand({
      TableName: getTableName('events'),
      ...(dateFilter && {
        FilterExpression: 'begins_with(#d, :datePrefix)',
        ExpressionAttributeNames: { '#d': 'date' },
        ExpressionAttributeValues: { ':datePrefix': dateFilter },
      }),
    })
  );
  return (result.Items ?? []).map((i) =>
    formatEvent(i as Record<string, unknown>)
  );
};

export const updateEvent = async (
  id: string,
  updates: Partial<Pick<Event, 'name' | 'description' | 'date' | 'location' | 'capacity'>>
): Promise<void> => {
  const keys = Object.keys(updates).filter((k) => updates[k as keyof typeof updates] !== undefined);
  if (keys.length === 0) return;

  const expressions = keys.map((k, i) => `#f${i} = :v${i}`);
  const names = keys.reduce(
    (acc, k, i) => ({ ...acc, [`#f${i}`]: k }),
    {} as Record<string, string>
  );
  const values = keys.reduce(
    (acc, k, i) => ({ ...acc, [`:v${i}`]: updates[k as keyof typeof updates] }),
    {} as Record<string, unknown>
  );

  await client.send(
    new UpdateCommand({
      TableName: getTableName('events'),
      Key: { id },
      UpdateExpression: `SET ${expressions.join(', ')}`,
      ExpressionAttributeNames: { ...names },
      ExpressionAttributeValues: { ...values },
    })
  );
};

export const deleteEvent = async (id: string): Promise<void> => {
  await client.send(
    new DeleteCommand({
      TableName: getTableName('events'),
      Key: { id },
    })
  );
};
