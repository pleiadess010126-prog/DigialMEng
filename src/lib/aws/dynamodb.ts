// AWS DynamoDB Client Configuration
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { Campaign, ContentItem, TopicPillar, RiskAlert } from '@/types';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
        : undefined,
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLES = {
    CAMPAIGNS: process.env.DYNAMODB_CAMPAIGNS_TABLE || 'DigitalMEng-Campaigns',
    CONTENT: process.env.DYNAMODB_CONTENT_TABLE || 'DigitalMEng-ContentItems',
    PILLARS: process.env.DYNAMODB_PILLARS_TABLE || 'DigitalMEng-TopicPillars',
};

// ========== CAMPAIGNS ==========

export async function createCampaign(userId: string, campaign: Campaign) {
    const command = new PutCommand({
        TableName: TABLES.CAMPAIGNS,
        Item: {
            userId,
            campaignId: campaign.id,
            ...campaign,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });

    await docClient.send(command);
    return campaign;
}

export async function getCampaign(userId: string, campaignId: string) {
    const command = new GetCommand({
        TableName: TABLES.CAMPAIGNS,
        Key: {
            userId,
            campaignId,
        },
    });

    const response = await docClient.send(command);
    return response.Item as Campaign | undefined;
}

export async function listCampaigns(userId: string) {
    const command = new QueryCommand({
        TableName: TABLES.CAMPAIGNS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    });

    const response = await docClient.send(command);
    return (response.Items || []) as Campaign[];
}

export async function updateCampaign(userId: string, campaignId: string, updates: Partial<Campaign>) {
    const command = new UpdateCommand({
        TableName: TABLES.CAMPAIGNS,
        Key: {
            userId,
            campaignId,
        },
        UpdateExpression: 'set #name = :name, #status = :status, stats = :stats, settings = :settings, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':name': updates.name,
            ':status': updates.status,
            ':stats': updates.stats,
            ':settings': updates.settings,
            ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return response.Attributes as Campaign;
}

export async function deleteCampaign(userId: string, campaignId: string) {
    const command = new DeleteCommand({
        TableName: TABLES.CAMPAIGNS,
        Key: {
            userId,
            campaignId,
        },
    });

    await docClient.send(command);
}

// ========== CONTENT ITEMS ==========

export async function createContentItem(campaignId: string, content: ContentItem) {
    const command = new PutCommand({
        TableName: TABLES.CONTENT,
        Item: {
            campaignId,
            contentId: content.id,
            ...content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });

    await docClient.send(command);
    return content;
}

export async function getContentItem(campaignId: string, contentId: string) {
    const command = new GetCommand({
        TableName: TABLES.CONTENT,
        Key: {
            campaignId,
            contentId,
        },
    });

    const response = await docClient.send(command);
    return response.Item as ContentItem | undefined;
}

export async function listContentItems(campaignId: string) {
    const command = new QueryCommand({
        TableName: TABLES.CONTENT,
        KeyConditionExpression: 'campaignId = :campaignId',
        ExpressionAttributeValues: {
            ':campaignId': campaignId,
        },
    });

    const response = await docClient.send(command);
    return (response.Items || []) as ContentItem[];
}

export async function updateContentItem(campaignId: string, contentId: string, updates: Partial<ContentItem>) {
    const command = new UpdateCommand({
        TableName: TABLES.CONTENT,
        Key: {
            campaignId,
            contentId,
        },
        UpdateExpression: 'set title = :title, #status = :status, content = :content, metadata = :metadata, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':title': updates.title,
            ':status': updates.status,
            ':content': updates.content,
            ':metadata': updates.metadata,
            ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    });

    const response = await docClient.send(command);
    return response.Attributes as ContentItem;
}

export async function deleteContentItem(campaignId: string, contentId: string) {
    const command = new DeleteCommand({
        TableName: TABLES.CONTENT,
        Key: {
            campaignId,
            contentId,
        },
    });

    await docClient.send(command);
}

// ========== TOPIC PILLARS ==========

export async function createTopicPillar(campaignId: string, pillar: TopicPillar) {
    const command = new PutCommand({
        TableName: TABLES.PILLARS,
        Item: {
            campaignId,
            pillarId: pillar.id,
            ...pillar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });

    await docClient.send(command);
    return pillar;
}

export async function listTopicPillars(campaignId: string) {
    const command = new QueryCommand({
        TableName: TABLES.PILLARS,
        KeyConditionExpression: 'campaignId = :campaignId',
        ExpressionAttributeValues: {
            ':campaignId': campaignId,
        },
    });

    const response = await docClient.send(command);
    return (response.Items || []) as TopicPillar[];
}

export { docClient };
