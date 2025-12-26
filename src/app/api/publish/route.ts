import { NextRequest, NextResponse } from 'next/server';
import { getPublishingQueue } from '@/lib/platforms/publishingQueue';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { contentId, platforms, scheduledFor, credentials } = body;

        if (!contentId || !platforms || !Array.isArray(platforms)) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: contentId, platforms' },
                { status: 400 }
            );
        }

        // TODO: In production, get contentItem from DynamoDB
        // For now, we'll return a placeholder response

        // Initialize publishing queue with credentials
        if (credentials) {
            const queue = getPublishingQueue(credentials);

            // Add mock content item for testing
            const mockContentItem: any = {
                id: contentId,
                title: 'Test Content',
                type: platforms.includes('wordpress') ? 'blog' : 'instagram-reel',
                status: 'approved',
                content: 'Test content for publishing',
                metadata: {
                    keywords: ['test'],
                    topicPillar: 'Test',
                    seoScore: 85,
                },
                createdAt: new Date(),
            };

            const task = queue.addToQueue(
                mockContentItem,
                platforms,
                scheduledFor ? new Date(scheduledFor) : undefined
            );

            // Process immediately if not scheduled
            if (!scheduledFor) {
                await queue.processQueue();
            }

            return NextResponse.json({
                success: true,
                taskId: task.id,
                message: scheduledFor
                    ? `Scheduled for ${new Date(scheduledFor).toLocaleString()}`
                    : 'Publishing started',
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Platform credentials required. Configure in settings.',
        }, { status: 400 });
    } catch (error: any) {
        console.error('Publishing error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Publishing failed' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const taskId = request.nextUrl.searchParams.get('taskId');

        // TODO: Get credentials from user session/database
        const queue = getPublishingQueue();

        if (taskId) {
            const task = queue.getTask(taskId);
            return NextResponse.json({
                success: !!task,
                task,
            });
        }

        const status = queue.getQueueStatus();
        return NextResponse.json({
            success: true,
            ...status,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to get queue status' },
            { status: 500 }
        );
    }
}
