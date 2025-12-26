// WordPress REST API Client
// Auto-publishes blog posts to WordPress sites

export interface WordPressConfig {
    url: string;
    username: string;
    appPassword: string;
}

export interface WordPressPost {
    title: string;
    content: string;
    excerpt?: string;
    status: 'draft' | 'publish' | 'pending';
    categories?: number[];
    tags?: number[];
    featured_media?: number;
    meta?: {
        seo_title?: string;
        seo_description?: string;
        seo_keywords?: string;
    };
}

export interface WordPressResponse {
    success: boolean;
    postId?: number;
    postUrl?: string;
    error?: string;
}

/**
 * WordPress API Client
 */
export class WordPressClient {
    private config: WordPressConfig;
    private baseUrl: string;

    constructor(config: WordPressConfig) {
        this.config = config;
        this.baseUrl = `${config.url}/wp-json/wp/v2`;
    }

    /**
     * Get authorization header
     */
    private getAuthHeader(): string {
        const credentials = Buffer.from(`${this.config.username}:${this.config.appPassword}`).toString('base64');
        return `Basic ${credentials}`;
    }

    /**
     * Test connection to WordPress
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/users/me`, {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            });

            if (response.ok) {
                const user = await response.json();
                return {
                    success: true,
                    message: `Connected as ${user.name} (${user.email})`,
                };
            }

            return {
                success: false,
                message: 'Authentication failed. Check credentials.',
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Connection failed',
            };
        }
    }

    /**
     * Create a new post
     */
    async createPost(post: WordPressPost): Promise<WordPressResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.getAuthHeader(),
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.message || 'Failed to create post',
                };
            }

            const data = await response.json();

            return {
                success: true,
                postId: data.id,
                postUrl: data.link,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to create post',
            };
        }
    }

    /**
     * Update existing post
     */
    async updatePost(postId: number, updates: Partial<WordPressPost>): Promise<WordPressResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: this.getAuthHeader(),
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    error: error.message || 'Failed to update post',
                };
            }

            const data = await response.json();

            return {
                success: true,
                postId: data.id,
                postUrl: data.link,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to update post',
            };
        }
    }

    /**
     * Delete post
     */
    async deletePost(postId: number): Promise<WordPressResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            });

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
                error: error.message || 'Failed to delete post',
            };
        }
    }

    /**
     * Get categories
     */
    async getCategories(): Promise<any[]> {
        try {
            const response = await fetch(`${this.baseUrl}/categories`, {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            });

            if (response.ok) {
                return await response.json();
            }

            return [];
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            return [];
        }
    }

    /**
     * Get tags
     */
    async getTags(): Promise<any[]> {
        try {
            const response = await fetch(`${this.baseUrl}/tags`, {
                headers: {
                    Authorization: this.getAuthHeader(),
                },
            });

            if (response.ok) {
                return await response.json();
            }

            return [];
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            return [];
        }
    }

    /**
     * Upload media (for featured images)
     */
    async uploadMedia(file: File): Promise<{ success: boolean; mediaId?: number; error?: string }> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseUrl}/media`, {
                method: 'POST',
                headers: {
                    Authorization: this.getAuthHeader(),
                },
                body: formData,
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: 'Failed to upload media',
                };
            }

            const data = await response.json();

            return {
                success: true,
                mediaId: data.id,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Failed to upload media',
            };
        }
    }
}

/**
 * Create WordPress client instance
 */
export function createWordPressClient(config: WordPressConfig): WordPressClient {
    return new WordPressClient(config);
}
