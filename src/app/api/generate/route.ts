import { NextRequest, NextResponse } from 'next/server';
import { generateContent, getAvailableProvider } from '@/lib/ai/contentGenerator';
import { getSupervisorAgent } from '@/lib/ai/supervisor';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, keywords, contentType, targetAudience, useSupervisor = false } = body;

        if (!topic || !keywords || !contentType) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: topic, keywords, contentType' },
                { status: 400 }
            );
        }

        // Check which AI provider is available
        const provider = getAvailableProvider();
        console.log(`Using AI provider: ${provider}`);

        let result;

        if (useSupervisor) {
            // Use supervisor agent for orchestrated generation
            const supervisor = getSupervisorAgent();
            const task = await supervisor.delegateContentCreation(
                { id: 'temp', name: topic, keywords, contentCount: 1, description: '' },
                contentType,
                targetAudience || 'general audience'
            );

            result = task.result;
        } else {
            // Direct generation
            result = await generateContent({
                topic,
                keywords,
                contentType,
                targetAudience: targetAudience || 'general audience',
            });
        }

        return NextResponse.json({
            success: true,
            content: result,
            provider,
            message: provider === 'mock'
                ? 'Using mock generator. Add OPENAI_API_KEY or AWS Bedrock credentials for AI generation.'
                : 'Content generated successfully',
        });
    } catch (error: any) {
        console.error('Content generation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Content generation failed' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const provider = getAvailableProvider();

    return NextResponse.json({
        currentProvider: provider,
        availableProviders: {
            bedrock: !!process.env.AWS_REGION && !!process.env.AWS_ACCESS_KEY_ID,
            openai: !!process.env.OPENAI_API_KEY,
            anthropic: !!process.env.ANTHROPIC_API_KEY,
            mock: true,
        },
        status: 'ready',
    });
}
