// AWS S3 Client Configuration
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.S3_REGION || process.env.CUSTOM_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
    credentials: process.env.CUSTOM_AWS_ACCESS_KEY_ID && process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
        }
        : process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
            ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
            : undefined,
});

const BUCKET_NAME = process.env.S3_CONTENT_BUCKET || 'digital-meng-content';

export interface UploadParams {
    key: string;
    body: Buffer | Uint8Array | string;
    contentType?: string;
    metadata?: Record<string, string>;
}

/**
 * Upload file to S3
 */
export async function uploadFile({ key, body, contentType, metadata }: UploadParams) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType || 'application/octet-stream',
            Metadata: metadata,
        });

        await s3Client.send(command);

        return {
            success: true,
            key,
            url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
        };
    } catch (error: any) {
        console.error('S3 upload error:', error);
        return {
            success: false,
            error: error.message || 'Upload failed',
        };
    }
}

/**
 * Get presigned URL for secure file access
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });

        return {
            success: true,
            url,
        };
    } catch (error: any) {
        console.error('Presigned URL error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate URL',
        };
    }
}

/**
 * Get presigned URL for upload
 */
export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn });

        return {
            success: true,
            url,
            key,
        };
    } catch (error: any) {
        console.error('Presigned upload URL error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate upload URL',
        };
    }
}

/**
 * Delete file from S3
 */
export async function deleteFile(key: string) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);

        return {
            success: true,
            message: 'File deleted successfully',
        };
    } catch (error: any) {
        console.error('S3 delete error:', error);
        return {
            success: false,
            error: error.message || 'Delete failed',
        };
    }
}

/**
 * List files in a folder
 */
export async function listFiles(prefix: string = '', maxKeys: number = 1000) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            MaxKeys: maxKeys,
        });

        const response = await s3Client.send(command);

        return {
            success: true,
            files: response.Contents?.map((item) => ({
                key: item.Key,
                size: item.Size,
                lastModified: item.LastModified,
                url: `https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
            })) || [],
        };
    } catch (error: any) {
        console.error('S3 list error:', error);
        return {
            success: false,
            error: error.message || 'Failed to list files',
        };
    }
}

/**
 * Generate unique file key
 */
export function generateFileKey(userId: string, campaignId: string, filename: string) {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `users/${userId}/campaigns/${campaignId}/${timestamp}-${sanitizedFilename}`;
}

export { s3Client };
