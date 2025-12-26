import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/aws/cognito';
import * as jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Authenticate with Cognito
        const result = await signIn({ email, password });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 401 }
            );
        }

        // Decode the ID token to get user info
        const decoded: any = jwt.decode(result.tokens?.idToken || '');

        const user = {
            id: decoded?.sub || '',
            email: decoded?.email || email,
            name: decoded?.name || '',
        };

        return NextResponse.json({
            success: true,
            user,
            tokens: result.tokens,
        });
    } catch (error: any) {
        console.error('Sign in API error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Sign in failed' },
            { status: 500 }
        );
    }
}
