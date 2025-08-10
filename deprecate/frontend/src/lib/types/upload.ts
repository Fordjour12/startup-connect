/**
 * Upload-related TypeScript interfaces
 * Updated to match backend UploadResponse structure
 */

// Updated interface to match new backend UploadResponse
export interface UploadedFile {
	success: boolean;
	file_id: string;              // Changed from file_key
	filename: string;             // Changed from file_name
	content_type: string;         // New field
	size: number;                 // Changed from file_size
	url: string;                  // Changed from file_url
	thumbnail_url?: string;       // New field for images
	variants?: Record<string, string>; // New field - different image sizes
	file_metadata?: Record<string, string | number | boolean>; // New field
	upload_date: string;          // New field (ISO date string)
	type?: string;                // Keep for frontend categorization
}

// Legacy interface for backward compatibility
export interface LegacyUploadedFile {
	file_key: string;
	file_url: string;
	file_name: string;
	file_size: number;
	type?: string;
}

// Interface for batch upload response
export interface BatchUploadResponse {
	total_files: number;
	successful_uploads: UploadedFile[];
	failed_uploads: Array<{
		filename: string;
		error: string;
		content_type: string;
	}>;
	success_count: number;
	error_count: number;
}

// Upload service configuration
export interface UploadConfig {
	maxFileSize: number;
	allowedTypes: string[];
	retries: number;
}

// File upload progress callback
export type UploadProgressCallback = (progress: number) => void;

// Startup files form data structure
export interface StartupFilesFormData {
	logo?: File;
	pitchDeck?: File;
	productScreenshots?: File[];
	demoVideo?: File;
}

// Upload queue item for batch processing
export interface UploadQueueItem {
	file: File;
	endpoint: string;
	type: string;
}

// File upload result for legacy functions
export interface UploadResult {
	uploadedFiles: UploadedFile[];
	fileIds: string[];
}

// Enhanced startup data with file URLs and metadata
export interface StartupDataWithFiles {
	// Basic startup data
	name: string;
	description: string;
	industry: string;
	location: string;
	funding_stage: string;
	founded_year: number;
	team_size: number;
	website: string;
	business_model: string;
	target_market: string;
	competitors: string[];
	is_published: boolean;

	// File references using new field names
	logo_url?: string;
	logo_thumbnail_url?: string;    // NEW: thumbnail for logo
	pitch_deck_url?: string;
	demo_video_url?: string;
	product_screenshots_urls?: string[];

	// Enhanced metadata
	logo_metadata?: Record<string, string | number | boolean>;
	demo_video_metadata?: Record<string, string | number | boolean>;

	// Nested objects
	team_members?: string[];
	funding?: any;
	metrics?: any;
	social_media?: any;
	contact?: any;
	traction?: any;
	use_of_funds?: any;
	timeline?: any;
}