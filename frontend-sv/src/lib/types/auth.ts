export interface UserPublic {
	id: string;
	email: string;
	full_name: string;
	role: string;
	is_active: boolean;
	is_verified: boolean;
	created_at: string;
	updated_at: string;
}

export interface Token {
	access_token: string;
	token_type: string;
}

export interface UserRegistrationResponse {
	user: UserPublic;
	access_token: string;
	token_type: string;
	message: string;
}

export interface EmailVerificationResponse {
	message: string;
	user?: UserPublic | null;
}

export interface PasswordResetResponse {
	message: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	new_password: string;
}

export interface ApiError {
	detail: string;
}

export interface RegisterRequest {
	full_name: string;
	email: string;
	password: string;
	role: string;
} 