import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import type { User } from '@event-platform/shared';
import { getTableName } from '../lib/db';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await client.send(
    new QueryCommand({
      TableName: getTableName('users'),
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
    })
  );

  const item = result.Items?.[0];
  return item ? (item as unknown as User) : null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await client.send(
    new GetCommand({
      TableName: getTableName('users'),
      Key: { id },
    })
  );

  return result.Item ? (result.Item as unknown as User) : null;
};

export const createUser = async (user: User): Promise<void> => {
  await client.send(
    new PutCommand({
      TableName: getTableName('users'),
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)',
    })
  );
};
