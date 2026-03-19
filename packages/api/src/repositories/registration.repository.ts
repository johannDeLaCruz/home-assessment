import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Registration } from '@event-platform/shared';
import { getTableName } from '../lib/db';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const toRegistration = (item: Record<string, unknown>): Registration => ({
  id: `${item.eventId}#${item.userId}`,
  eventId: item.eventId as string,
  userId: item.userId as string,
  createdAt: item.createdAt as string,
});

export const getByEventId = async (eventId: string): Promise<Registration[]> => {
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName('registrations'),
      KeyConditionExpression: 'eventId = :eventId',
      ExpressionAttributeValues: { ':eventId': eventId },
    })
  );
  return (result.Items ?? []).map(toRegistration);
};

export const getByUserId = async (userId: string): Promise<Registration[]> => {
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName('registrations'),
      IndexName: 'user-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    })
  );
  return (result.Items ?? []).map(toRegistration);
};

export const getOne = async (
  eventId: string,
  userId: string
): Promise<Registration | null> => {
  const result = await client.send(
    new GetCommand({
      TableName: getTableName('registrations'),
      Key: { eventId, userId },
    })
  );
  if (!result.Item) return null;
  return toRegistration(result.Item as Record<string, unknown>);
};

export const create = async (
  eventId: string,
  userId: string
): Promise<Registration> => {
  const now = new Date().toISOString();
  const item = { eventId, userId, createdAt: now };
  await client.send(
    new PutCommand({
      TableName: getTableName('registrations'),
      Item: item,
    })
  );
  return toRegistration(item);
};

export const remove = async (
  eventId: string,
  userId: string
): Promise<void> => {
  await client.send(
    new DeleteCommand({
      TableName: getTableName('registrations'),
      Key: { eventId, userId },
    })
  );
};
