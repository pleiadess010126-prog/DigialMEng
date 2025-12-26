// Mock Data Store for Local Development
import type { Campaign, ContentItem, TopicPillar, RiskAlert, AIAgent, RoadmapItem } from '@/types';

export const mockCampaign: Campaign = {
    id: 'camp_001',
    name: 'Q1 2025 Growth Campaign',
    status: 'active',
    createdAt: new Date('2025-01-01'),
    stats: {
        totalContent: 145,
        publishedThisMonth: 28,
        organicTraffic: 12547,
        trafficGrowth: 23.5,
        avgDwellTime: 125,
        indexationRate: 76,
        riskScore: 15,
    },
    settings: {
        velocity: {
            month1: 10,
            month2: 20,
            month3: 40,
        },
        contentTypes: {
            blog: true,
            youtube: true,
            instagram: true,
            facebook: true,
        },
        autoPublish: false,
        requireApproval: true,
    },
};

export const mockTopicPillars: TopicPillar[] = [
    {
        id: 'pillar_001',
        name: 'Digital Marketing Automation',
        description: 'AI-powered marketing strategies and automation tools',
        keywords: ['marketing automation', 'AI marketing', 'growth hacking'],
        contentCount: 24,
        priority: 1,
    },
    {
        id: 'pillar_002',
        name: 'SEO Best Practices',
        description: 'Modern SEO techniques and organic growth strategies',
        keywords: ['SEO optimization', 'organic traffic', 'search rankings'],
        contentCount: 18,
        priority: 2,
    },
    {
        id: 'pillar_003',
        name: 'Social Media Strategy',
        description: 'Content strategies for YouTube, Instagram, and Facebook',
        keywords: ['social media marketing', 'content strategy', 'engagement'],
        contentCount: 32,
        priority: 3,
    },
    {
        id: 'pillar_004',
        name: 'Content Creation & Optimization',
        description: 'Creating high-quality, engaging content that converts',
        keywords: ['content marketing', 'copywriting', 'conversion optimization'],
        contentCount: 21,
        priority: 4,
    },
];

export const mockContentItems: ContentItem[] = [
    {
        id: 'content_001',
        title: '10 AI Tools That Will Transform Your Marketing in 2025',
        type: 'blog',
        status: 'published',
        createdAt: new Date('2025-01-15'),
        publishedAt: new Date('2025-01-16'),
        content: 'Full article content here...',
        metadata: {
            keywords: ['AI marketing', 'marketing tools', 'automation'],
            topicPillar: 'Digital Marketing Automation',
            targetKeyword: 'AI marketing tools 2025',
            seoScore: 92,
        },
        performance: {
            views: 1247,
            engagement: 18.5,
            dwellTime: 145,
        },
    },
    {
        id: 'content_002',
        title: 'How to Rank #1 on Google Without Paid Ads',
        type: 'youtube-short',
        status: 'approved',
        createdAt: new Date('2025-01-18'),
        scheduledFor: new Date('2025-01-20'),
        content: 'Video script here...',
        metadata: {
            keywords: ['SEO ranking', 'organic traffic', 'Google algorithm'],
            topicPillar: 'SEO Best Practices',
            targetKeyword: 'rank on Google',
            seoScore: 88,
        },
    },
    {
        id: 'content_003',
        title: 'Instagram Reels Algorithm Revealed',
        type: 'instagram-reel',
        status: 'pending',
        createdAt: new Date('2025-01-19'),
        content: 'Reel concept and script...',
        metadata: {
            keywords: ['Instagram algorithm', 'Reels strategy', 'viral content'],
            topicPillar: 'Social Media Strategy',
            targetKeyword: 'Instagram Reels tips',
            seoScore: 85,
        },
    },
    {
        id: 'content_004',
        title: 'The Ultimate Guide to Programmatic SEO',
        type: 'blog',
        status: 'draft',
        createdAt: new Date('2025-01-20'),
        content: 'Article draft...',
        metadata: {
            keywords: ['programmatic SEO', 'pSEO strategy', 'scale content'],
            topicPillar: 'SEO Best Practices',
            targetKeyword: 'programmatic SEO guide',
            seoScore: 78,
        },
    },
];

export const mockRiskAlerts: RiskAlert[] = [
    {
        id: 'risk_001',
        severity: 'medium',
        type: 'indexation',
        message: 'Indexation rate dropped to 72% (target: >80%)',
        detectedAt: new Date('2025-01-18'),
        resolved: false,
        recommendation: 'Reduce publishing velocity by 20% for the next 2 weeks and improve internal linking structure.',
    },
    {
        id: 'risk_002',
        severity: 'low',
        type: 'bounce-rate',
        message: 'Bounce rate increased to 68% on recent blog posts',
        detectedAt: new Date('2025-01-17'),
        resolved: false,
        recommendation: 'Add more engaging media (images, videos) and improve content structure with better headings.',
    },
];

export const mockAIAgents: AIAgent[] = [
    {
        id: 'agent_supervisor',
        name: 'Bedrock Supervisor',
        type: 'supervisor',
        status: 'working',
        lastActive: new Date(),
        tasksCompleted: 247,
    },
    {
        id: 'agent_seo',
        name: 'SEO Content Worker',
        type: 'seo-worker',
        status: 'working',
        lastActive: new Date(),
        tasksCompleted: 89,
    },
    {
        id: 'agent_social',
        name: 'Social Media Worker',
        type: 'social-worker',
        status: 'idle',
        lastActive: new Date(Date.now() - 1000 * 60 * 15),
        tasksCompleted: 76,
    },
    {
        id: 'agent_risk',
        name: 'Risk Monitor',
        type: 'risk-worker',
        status: 'working',
        lastActive: new Date(),
        tasksCompleted: 142,
    },
];

export const mockRoadmap: RoadmapItem[] = [
    { week: 1, month: 1, contentTarget: 5, topics: ['Digital Marketing Automation'], status: 'completed' },
    { week: 2, month: 1, contentTarget: 5, topics: ['SEO Best Practices'], status: 'completed' },
    { week: 3, month: 1, contentTarget: 7, topics: ['Social Media Strategy'], status: 'in-progress' },
    { week: 4, month: 1, contentTarget: 8, topics: ['Content Creation & Optimization'], status: 'upcoming' },
    { week: 5, month: 2, contentTarget: 10, topics: ['Digital Marketing Automation', 'SEO Best Practices'], status: 'upcoming' },
    { week: 6, month: 2, contentTarget: 10, topics: ['Social Media Strategy'], status: 'upcoming' },
];
