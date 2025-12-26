// Publishing Queue Manager
// Orchestrates content publishing across all platforms

import { createWordPressClient, WordPressConfig } from './wordpress';
import { createYouTubeClient, YouTubeConfig } from './youtube';
import { createMetaClient, MetaConfig } from './meta';
import type { ContentItem } from '@/types';

export interface PlatformCredentials {
    wordpress?: WordPressConfig;
    youtube?: YouTubeConfig;
    meta?: MetaConfig;
}

export interface PublishTask {
    id: string;
    contentItem: ContentItem;
    platforms: ('wordpress' | 'youtube' | 'instagram' | 'facebook')[];
    status: 'queued' | 'processing' | 'completed' | 'failed';
    scheduledFor?: Date;
    results: {
        platform: string;
        success: boolean;
        postId?: string;
        postUrl?: string;
        error?: string;
    }[];
    createdAt: Date;
    completedAt?: Date;
}

/**
 * Publishing Queue Manager
 */
export class PublishingQueue {
    private credentials: PlatformCredentials;
    private queue: PublishTask[] = [];
    private processing: PublishTask[] = [];
    private completed: PublishTask[] = [];

    constructor(credentials: PlatformCredentials) {
        this.credentials = credentials;
    }

    /**
     * Add content to publishing queue
     */
    addToQueue(
        contentItem: ContentItem,
        platforms: ('wordpress' | 'youtube' | 'instagram' | 'facebook')[],
        scheduledFor?: Date
    ): PublishTask {
        const task: PublishTask = {
            id: `publish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            contentItem,
            platforms,
            status: 'queued',
            scheduledFor,
            results: [],
            createdAt: new Date(),
        };

        this.queue.push(task);
        console.log(`📋 Publishing Queue: Added task ${task.id} for ${platforms.join(', ')}`);

        return task;
    }

    /**
     * Process queue - publish to selected platforms
     */
    async processQueue(): Promise<void> {
        const now = new Date();

        // Get tasks ready to publish
        const readyTasks = this.queue.filter(
            task => !task.scheduledFor || task.scheduledFor <= now
        );

        for (const task of readyTasks) {
            await this.processTask(task);
        }
    }

    /**
     * Process single publishing task
     */
    private async processTask(task: PublishTask): Promise<void> {
        // Move to processing
        this.queue = this.queue.filter(t => t.id !== task.id);
        this.processing.push(task);
        task.status = 'processing';

        console.log(`🚀 Publishing: Starting task ${task.id}`);

        // Publish to each platform
        for (const platform of task.platforms) {
            try {
                const result = await this.publishToPlatform(task.contentItem, platform);
                task.results.push(result);
            } catch (error: any) {
                task.results.push({
                    platform,
                    success: false,
                    error: error.message || 'Unknown error',
                });
            }
        }

        // Mark as completed
        task.status = task.results.every(r => r.success) ? 'completed' : 'failed';
        task.completedAt = new Date();

        this.processing = this.processing.filter(t => t.id !== task.id);
        this.completed.push(task);

        console.log(`✅ Publishing: Completed task ${task.id} - ${task.status}`);
    }

    /**
     * Publish to specific platform
     */
    private async publishToPlatform(
        content: ContentItem,
        platform: 'wordpress' | 'youtube' | 'instagram' | 'facebook'
    ): Promise<PublishTask['results'][0]> {
        console.log(`📤 Publishing to ${platform}: ${content.title}`);

        switch (platform) {
            case 'wordpress':
                return await this.publishToWordPress(content);

            case 'youtube':
                return await this.publishToYouTube(content);

            case 'instagram':
                return await this.publishToInstagram(content);

            case 'facebook':
                return await this.publishToFacebook(content);

            default:
                return {
                    platform,
                    success: false,
                    error: 'Unsupported platform',
                };
        }
    }

    /**
     * Publish to WordPress
     */
    private async publishToWordPress(content: ContentItem): Promise<PublishTask['results'][0]> {
        if (!this.credentials.wordpress) {
            return { platform: 'wordpress', success: false, error: 'WordPress not configured' };
        }

        if (content.type !== 'blog') {
            return {
                platform: 'wordpress',
                success: false,
                error: 'Only blog content can be published to WordPress',
            };
        }

        const client = createWordPressClient(this.credentials.wordpress);

        const result = await client.createPost({
            title: content.title,
            content: content.content,
            status: 'publish',
            meta: {
                seo_title: content.title,
                seo_description: content.content.substring(0, 160),
                seo_keywords: content.metadata.keywords.join(', '),
            },
        });

        return {
            platform: 'wordpress',
            success: result.success,
            postId: result.postId?.toString(),
            postUrl: result.postUrl,
            error: result.error,
        };
    }

    /**
     * Publish to YouTube
     */
    private async publishToYouTube(content: ContentItem): Promise<PublishTask['results'][0]> {
        if (!this.credentials.youtube) {
            return { platform: 'youtube', success: false, error: 'YouTube not configured' };
        }

        if (content.type !== 'youtube-short') {
            return {
                platform: 'youtube',
                success: false,
                error: 'Only YouTube Short content can be published to YouTube',
            };
        }

        // Note: For production, you need to generate video from script
        // This is a placeholder
        return {
            platform: 'youtube',
            success: false,
            error: 'Video generation not implemented. Need text-to-video service.',
        };
    }

    /**
     * Publish to Instagram
     */
    private async publishToInstagram(content: ContentItem): Promise<PublishTask['results'][0]> {
        if (!this.credentials.meta) {
            return { platform: 'instagram', success: false, error: 'Meta not configured' };
        }

        if (content.type !== 'instagram-reel') {
            return {
                platform: 'instagram',
                success: false,
                error: 'Only Instagram Reel content can be published to Instagram',
            };
        }

        // Note: For production, you need video URL
        // This is a placeholder
        return {
            platform: 'instagram',
            success: false,
            error: 'Video generation not implemented. Need video URL.',
        };
    }

    /**
     * Publish to Facebook
     */
    private async publishToFacebook(content: ContentItem): Promise<PublishTask['results'][0]> {
        if (!this.credentials.meta) {
            return { platform: 'facebook', success: false, error: 'Meta not configured' };
        }

        if (content.type !== 'facebook-story') {
            return {
                platform: 'facebook',
                success: false,
                error: 'Only Facebook Story content can be published to Facebook',
            };
        }

        const client = createMetaClient(this.credentials.meta);

        const result = await client.postToFacebook({
            message: content.content,
        });

        return {
            platform: 'facebook',
            success: result.success,
            postId: result.postId,
            postUrl: result.postUrl,
            error: result.error,
        };
    }

    /**
     * Get queue status
     */
    getQueueStatus() {
        return {
            queued: this.queue.length,
            processing: this.processing.length,
            completed: this.completed.length,
            tasks: {
                queued: this.queue,
                processing: this.processing,
                completed: this.completed.slice(-10), // Last 10 completed
            },
        };
    }

    /**
     * Get task by ID
     */
    getTask(taskId: string): PublishTask | undefined {
        return [...this.queue, ...this.processing, ...this.completed].find(t => t.id === taskId);
    }

    /**
     * Cancel task
     */
    cancelTask(taskId: string): boolean {
        const index = this.queue.findIndex(t => t.id === taskId);
        if (index !== -1) {
            this.queue.splice(index, 1);
            return true;
        }
        return false;
    }
}

// Singleton instance
let publishingQueueInstance: PublishingQueue | null = null;

export function getPublishingQueue(credentials?: PlatformCredentials): PublishingQueue {
    if (!publishingQueueInstance && credentials) {
        publishingQueueInstance = new PublishingQueue(credentials);
    }

    if (!publishingQueueInstance) {
        throw new Error('Publishing queue not initialized. Provide credentials first.');
    }

    return publishingQueueInstance;
}
