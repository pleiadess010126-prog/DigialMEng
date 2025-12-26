// AWS Cognito Client Configuration
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, ConfirmSignUpCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1',
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';

export interface SignUpParams {
    email: string;
    password: string;
    name: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

export interface ConfirmSignUpParams {
    email: string;
    code: string;
}

export interface ForgotPasswordParams {
    email: string;
}

export interface ResetPasswordParams {
    email: string;
    code: string;
    newPassword: string;
}

/**
 * Sign up a new user
 */
export async function signUp({ email, password, name }: SignUpParams) {
    try {
        const command = new SignUpCommand({
            ClientId: CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'name',
                    Value: name,
                },
            ],
        });

        const response = await cognitoClient.send(command);
        return {
            success: true,
            userSub: response.UserSub,
            message: 'User registered successfully. Please check your email for verification code.',
        };
    } catch (error: any) {
        console.error('Sign up error:', error);
        return {
            success: false,
            error: error.message || 'Sign up failed',
        };
    }
}

/**
 * Confirm sign up with verification code
 */
export async function confirmSignUp({ email, code }: ConfirmSignUpParams) {
    try {
        const command = new ConfirmSignUpCommand({
            ClientId: CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
        });

        await cognitoClient.send(command);
        return {
            success: true,
            message: 'Email verified successfully. You can now sign in.',
        };
    } catch (error: any) {
        console.error('Confirm sign up error:', error);
        return {
            success: false,
            error: error.message || 'Verification failed',
        };
    }
}

/**
 * Sign in user and get tokens
 */
export async function signIn({ email, password }: SignInParams) {
    try {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });

        const response = await cognitoClient.send(command);

        if (response.AuthenticationResult) {
            return {
                success: true,
                tokens: {
                    accessToken: response.AuthenticationResult.AccessToken,
                    idToken: response.AuthenticationResult.IdToken,
                    refreshToken: response.AuthenticationResult.RefreshToken,
                    expiresIn: response.AuthenticationResult.ExpiresIn,
                },
            };
        }

        return {
            success: false,
            error: 'Authentication failed',
        };
    } catch (error: any) {
        console.error('Sign in error:', error);
        return {
            success: false,
            error: error.message || 'Sign in failed',
        };
    }
}

/**
 * Initiate forgot password flow
 */
export async function forgotPassword({ email }: ForgotPasswordParams) {
    try {
        const command = new ForgotPasswordCommand({
            ClientId: CLIENT_ID,
            Username: email,
        });

        await cognitoClient.send(command);
        return {
            success: true,
            message: 'Password reset code sent to your email.',
        };
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return {
            success: false,
            error: error.message || 'Failed to send reset code',
        };
    }
}

/**
 * Reset password with confirmation code
 */
export async function resetPassword({ email, code, newPassword }: ResetPasswordParams) {
    try {
        const command = new ConfirmForgotPasswordCommand({
            ClientId: CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            Password: newPassword,
        });

        await cognitoClient.send(command);
        return {
            success: true,
            message: 'Password reset successfully. You can now sign in.',
        };
    } catch (error: any) {
        console.error('Reset password error:', error);
        return {
            success: false,
            error: error.message || 'Password reset failed',
        };
    }
}

export { cognitoClient };
