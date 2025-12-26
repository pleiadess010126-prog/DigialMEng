// YouTube Data API v3 Client
// Uploads videos and Shorts to YouTube

export interface YouTubeConfig {
    apiKey: string;
    accessToken: string;
    channelId: string;
}

export interface YouTubeVideo {
    title: string;
    description: string;
    categoryId?: string;
    tags?: string[];
    privacyStatus: 'public' | 'unlisted' | 'private';
    isShort?: boolean; // For YouTube Shorts
}

export interface YouTubeResponse {
    success: boolean;
    videoId?: string;
    videoUrl?: string;
    error?: string;
}

/**
 * YouTube API Client
 */
export class YouTubeClient {
    private config: YouTubeConfig;
    private baseUrl = 'https://www.googleapis.com/youtube/v3';
    private uploadUrl = 'https://www.googleapis.com/upload/youtube/v3';

    constructor(config: YouTubeConfig) {
        this.config = config;
    }

    /**
     * Test connection to YouTube
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(
                `${this.baseUrl}/channels?part=snippet&id=${this.config.channelId}&key=${this.config.apiKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    return {
                        success: true,
                        message: `Connected to channel: ${data.items[0].snippet.title}`,
                    };
                }
            }

            return {
                success: false,
                message: 'Channel not found or no access',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }

    /**
     * Upload video to YouTube
     * Note: This is a simplified version. For production, use resumable upload
     */
    async uploadVideo(video: YouTubeVideo, videoFile: Blob): Promise<YouTubeResponse> {
        try {
            // Step 1: Create video metadata
            const metadata = {
                snippet: {
                    title: video.title,
                    description: video.description,
                    tags: video.tags || [],
                    categoryId: video.categoryId || '22', // 22 = People & Blogs
                },
                status: {
                    privacyStatus: video.privacyStatus,
                    selfDeclaredMadeForKids: false,
                },
            };

            // Step 2: Upload video (simplified - use multipart)
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            formData.append('video', videoFile);

            const response = await fetch(
                `${this.uploadUrl}/videos?uploadType=multipart&part=snippet,status&key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error?.message || 'Upload failed',
                };
            }

            const data = await response.json();

            return {
                success: true,
                videoId: data.id,
                videoUrl: `https://youtube.com/watch?v=${data.id}`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Upload failed',
            };
        }
    }

    /**
     * Upload YouTube Short
     * Shorts are videos < 60 seconds in vertical format
     */
    async uploadShort(video: YouTubeVideo, videoFile: Blob): Promise<YouTubeResponse> {
        // Add #Shorts to title/description for YouTube to recognize it
        const shortVideo = {
            ...video,
            title: video.title.includes('#Shorts') ? video.title : `${video.title} #Shorts`,
            description: video.description + '\n\n#Shorts',
        };

        return this.uploadVideo(shortVideo, videoFile);
    }

    /**
     * Update video metadata
     */
    async updateVideo(
        videoId: string,
        updates: Partial<YouTubeVideo>
    ): Promise<YouTubeResponse> {
        try {
            const updateData: any = {
                id: videoId,
            };

            if (updates.title || updates.description || updates.tags) {
                updateData.snippet = {
                    ...(updates.title && { title: updates.title }),
                    ...(updates.description && { description: updates.description }),
                    ...(updates.tags && { tags: updates.tags }),
                };
            }

            if (updates.privacyStatus) {
                updateData.status = {
                    privacyStatus: updates.privacyStatus,
                };
            }

            const response = await fetch(
                `${this.baseUrl}/videos?part=snippet,status&key=${this.config.apiKey}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to update video',
                };
            }

            return {
                success: true,
                videoId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Update failed',
            };
        }
    }

    /**
     * Delete video
     */
    async deleteVideo(videoId: string): Promise<YouTubeResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/videos?id=${videoId}&key=${this.config.apiKey}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to delete video',
                };
            }

            return {
                success: true,
                videoId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Delete failed',
            };
        }
    }

    /**
     * Get video analytics
     */
    async getVideoAnalytics(videoId: string): Promise<any> {
        try {
            const response = await fetch(
                `${this.baseUrl}/videos?part=statistics&id=${videoId}&key=${this.config.apiKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.config.accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    return data.items[0].statistics;
                }
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            return null;
        }
    }
}

/**
 * Create YouTube client instance
 */
export function createYouTubeClient(config: YouTubeConfig): YouTubeClient {
    return new YouTubeClient(config);
}

/**
 * Helper: Generate video file from script (for text-to-video)
 * This is a placeholder - in production, integrate with video generation service
 */
export async function generateVideoFromScript(script: string): Promise<Blob> {
    // TODO: Integrate with video generation service (e.g., D-ID, Synthesia, etc.)
    // For now, return a placeholder
    throw new Error('Video generation not yet implemented. Integrate with text-to-video service.');
}
