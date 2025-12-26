import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/aws/cognito';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Register with Cognito
        const result = await signUp({ email, password, name });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            userSub: result.userSub,
        });
    } catch (error: any) {
        console.error('Sign up API error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Sign up failed' },
            { status: 500 }
        );
    }
}
