'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateContentButtonProps {
    topic: string;
    keywords: string[];
    contentType: 'blog' | 'youtube-short' | 'instagram-reel' | 'facebook-story';
    onContentGenerated?: (content: any) => void;
}

export default function GenerateContentButton({
    topic,
    keywords,
    contentType,
    onContentGenerated,
}: GenerateContentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    keywords,
                    contentType,
                    targetAudience: 'digital marketers and content creators',
                    useSupervisor: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Content generated:', data.content);
                onContentGenerated?.(data.content);
            } else {
                setError(data.error || 'Generation failed');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary btn-sm flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                    </>
                )}
            </button>

            {error && (
                <p className="text-xs text-destructive mt-2">{error}</p>
            )}
        </div>
    );
}
