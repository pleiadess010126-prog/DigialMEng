'use client';

import { useState, useEffect } from 'react';
import { X, Save, Sparkles, Eye, Check } from 'lucide-react';
import type { ContentItem } from '@/types';

interface ContentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: ContentItem | null;
    onSave?: (updatedContent: ContentItem) => void;
    onApprove?: (content: ContentItem) => void;
}

export default function ContentPreviewModal({
    isOpen,
    onClose,
    content,
    onSave,
    onApprove,
}: ContentPreviewModalProps) {
    const [editedContent, setEditedContent] = useState<ContentItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (content) {
            setEditedContent({ ...content });
        }
    }, [content]);

    if (!isOpen || !editedContent) return null;

    const handleSave = () => {
        if (editedContent && onSave) {
            onSave(editedContent);
            setIsEditing(false);
        }
    };

    const handleApprove = () => {
        if (editedContent && onApprove) {
            onApprove({ ...editedContent, status: 'approved' });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="card-header flex-row items-center justify-between border-b border-border pb-4">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedContent.title}
                                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                                className="input text-lg font-semibold"
                            />
                        ) : (
                            <h2 className="card-title text-xl">{editedContent.title}</h2>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`badge ${editedContent.status === 'pending' ? 'badge-warning' :
                                    editedContent.status === 'approved' ? 'badge-success' :
                                        editedContent.status === 'published' ? 'badge-secondary' :
                                            'badge-default'
                                }`}>
                                {editedContent.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                SEO Score: {editedContent.metadata.seoScore}/100
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {editedContent.metadata.wordCount} words
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn-ghost btn-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="card-content flex-1 overflow-y-auto custom-scrollbar">
                    {isEditing ? (
                        <textarea
                            value={editedContent.content}
                            onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
                            className="textarea w-full min-h-[400px] font-mono text-sm"
                        />
                    ) : (
                        <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {editedContent.content}
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-sm font-semibold mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                            {editedContent.metadata.keywords.map((keyword, idx) => (
                                <span key={idx} className="badge badge-default text-xs">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hashtags (if social media content) */}
                    {editedContent.metadata.hashtags && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold mb-2">Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {editedContent.metadata.hashtags.map((tag, idx) => (
                                    <span key={idx} className="text-xs text-secondary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="card-header border-t border-border pt-4 flex-row items-center justify-between">
                    <div className="flex gap-2">
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="btn-ghost btn-md">
                                <Eye className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                        )}
                        {isEditing && (
                            <>
                                <button onClick={() => setIsEditing(false)} className="btn-ghost btn-md">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn-secondary btn-md">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {editedContent.status === 'pending' && (
                            <button onClick={handleApprove} className="btn-primary btn-md">
                                <Check className="w-4 h-4 mr-2" />
                                Approve & Publish
                            </button>
                        )}
                        {editedContent.status === 'approved' && (
                            <button className="btn-primary btn-md">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Publish Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
