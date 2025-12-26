// Meta Graph API Client
// Posts to Instagram and Facebook via Meta Graph API

export interface MetaConfig {
    appId: string;
    appSecret: string;
    accessToken: string;
    instagramAccountId?: string;
    facebookPageId?: string;
}

export interface InstagramReelPost {
    caption: string;
    videoUrl: string; // Must be publicly accessible
    coverUrl?: string;
    shareToFeed?: boolean;
}

export interface FacebookPost {
    message: string;
    link?: string;
    imageUrl?: string;
    videoUrl?: string;
}

export interface MetaResponse {
    success: boolean;
    postId?: string;
    postUrl?: string;
    error?: string;
}

/**
 * Meta Graph API Client
 */
export class MetaClient {
    private config: MetaConfig;
    private baseUrl = 'https://graph.facebook.com/v18.0';

    constructor(config: MetaConfig) {
        this.config = config;
    }

    /**
     * Test connection to Meta
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(
                `${this.baseUrl}/me?access_token=${this.config.accessToken}`
            );

            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    message: `Connected as ${data.name} (ID: ${data.id})`,
                };
            }

            return {
                success: false,
                message: 'Authentication failed',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }

    /**
     * Post Instagram Reel
     * Requires: Instagram Business or Creator account
     */
    async postInstagramReel(reel: InstagramReelPost): Promise<MetaResponse> {
        if (!this.config.instagramAccountId) {
            return {
                success: false,
                error: 'Instagram account ID not configured',
            };
        }

        try {
            // Step 1: Create media container
            const containerResponse = await fetch(
                `${this.baseUrl}/${this.config.instagramAccountId}/media`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        media_type: 'REELS',
                        video_url: reel.videoUrl,
                        caption: reel.caption,
                        cover_url: reel.coverUrl,
                        share_to_feed: reel.shareToFeed !== false,
                        access_token: this.config.accessToken,
                    }),
                }
            );

            if (!containerResponse.ok) {
                const error = await containerResponse.json();
                return {
                    success: false,
                    error: error.error?.message || 'Failed to create media container',
                };
            }

            const containerData = await containerResponse.json();
            const containerId = containerData.id;

            // Step 2: Publish the container
            const publishResponse = await fetch(
                `${this.baseUrl}/${this.config.instagramAccountId}/media_publish`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creation_id: containerId,
                        access_token: this.config.accessToken,
                    }),
                }
            );

            if (!publishResponse.ok) {
                const error = await publishResponse.json();
                return {
                    success: false,
                    error: error.error?.message || 'Failed to publish reel',
                };
            }

            const publishData = await publishResponse.json();

            return {
                success: true,
                postId: publishData.id,
                postUrl: `https://www.instagram.com/reel/${publishData.id}`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to post reel',
            };
        }
    }

    /**
     * Post to Facebook Page
     */
    async postToFacebook(post: FacebookPost): Promise<MetaResponse> {
        if (!this.config.facebookPageId) {
            return {
                success: false,
                error: 'Facebook page ID not configured',
            };
        }

        try {
            const postData: any = {
                message: post.message,
                access_token: this.config.accessToken,
            };

            if (post.link) {
                postData.link = post.link;
            }

            if (post.imageUrl) {
                postData.url = post.imageUrl;
            }

            const endpoint = post.videoUrl
                ? `${this.baseUrl}/${this.config.facebookPageId}/videos`
                : post.imageUrl
                    ? `${this.baseUrl}/${this.config.facebookPageId}/photos`
                    : `${this.baseUrl}/${this.config.facebookPageId}/feed`;

            if (post.videoUrl) {
                postData.file_url = post.videoUrl;
                delete postData.url;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error?.message || 'Failed to post to Facebook',
                };
            }

            const data = await response.json();

            return {
                success: true,
                postId: data.id,
                postUrl: `https://www.facebook.com/${data.id}`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to post to Facebook',
            };
        }
    }

    /**
     * Post Facebook Story
     */
    async postFacebookStory(imageUrl: string, linkUrl?: string): Promise<MetaResponse> {
        if (!this.config.facebookPageId) {
            return {
                success: false,
                error: 'Facebook page ID not configured',
            };
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.config.facebookPageId}/photos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: imageUrl,
                        published: false,
                        temporary: true,
                        ...(linkUrl && { link: linkUrl }),
                        access_token: this.config.accessToken,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.error?.message || 'Failed to post story',
                };
            }

            const data = await response.json();

            return {
                success: true,
                postId: data.id,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to post story',
            };
        }
    }

    /**
     * Delete Instagram post
     */
    async deleteInstagramPost(postId: string): Promise<MetaResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/${postId}?access_token=${this.config.accessToken}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to delete post',
                };
            }

            return {
                success: true,
                postId,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Delete failed',
            };
        }
    }

    /**
     * Get Instagram insights
     */
    async getInstagramInsights(postId: string): Promise<any> {
        try {
            const response = await fetch(
                `${this.baseUrl}/${postId}/insights?metric=impressions,reach,likes,comments,saves,shares&access_token=${this.config.accessToken}`
            );

            if (response.ok) {
                const data = await response.json();
                return data.data;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch insights:', error);
            return null;
        }
    }

    /**
     * Get Facebook page insights
     */
    async getFacebookInsights(): Promise<any> {
        if (!this.config.facebookPageId) {
            return null;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/${this.config.facebookPageId}/insights?metric=page_impressions,page_engaged_users,page_post_engagements&period=day&access_token=${this.config.accessToken}`
            );

            if (response.ok) {
                const data = await response.json();
                return data.data;
            }

            return null;
        } catch (error) {
            console.error('Failed to fetch page insights:', error);
            return null;
        }
    }
}

/**
 * Create Meta client instance
 */
export function createMetaClient(config: MetaConfig): MetaClient {
    return new MetaClient(config);
}
