// Define an enum for API endpoints
export enum ApiEndpoint {
  // User related endpoints
  GET_USER = '/users/me',
  UPDATE_USER = '/api/user/update',
  DELETE_USER = '/api/user/delete',

  // Authentication endpoints
  LOGIN = '/auth/login/access-token',
  REGISTER = '/auth/register',
  REGISTER_EMAIL_FIRST = '/auth/register-email-first',
  VERIFY_EMAIL = '/auth/verify-email',
  RESEND_VERIFICATION = '/auth/resend-verification',
  LOGOUT = '/auth/logout',
  FORGOT_PASSWORD = '/auth/forgot-password',
  RESET_PASSWORD = '/auth/reset-password',

  // Startup related endpoints
  GET_STARTUPS = '/startups/',
  GET_FOUNDER_STARTUPS = '/startups/founder/{founder_id}',
  CREATE_STARTUP = '/startups/create',
  UPDATE_STARTUP = '/startups/update',
  DELETE_STARTUP = '/startups/{startup_id}',
  GET_STARTUP_DETAILS = '/startups/{startup_id}',
  PUBLISH_STARTUP = '/startups/{startup_id}/publish',
  UNPUBLISH_STARTUP = '/startups/{startup_id}/unpublish',

  // Investor related endpoints
  GET_INVESTORS = '/investors/',
  GET_INVESTOR_DETAILS = '/investors/{investor_id}',

  // Recommendation endpoints
  GET_RECOMMENDATIONS = '/me/recommendations',
  GET_RECOMMENDATION_EXPLANATION = '/me/recommendations/explain',


  // Upload endpoints
  UPLOAD_IMAGE = '/upload/image',
  UPLOAD_DOCUMENT = '/upload/document',
  UPLOAD_VIDEO = '/upload/video',
  UPLOAD_PROFILE_IMAGE = '/upload/profile-image',
  UPLOAD_FILE = '/upload/video',
  UPLOAD_BATCH = '/upload/batch',
  UPLOAD_BATCH_ATOMIC = '/upload/batch-atomic',
  UPLOAD_STARTUP_FILES = '/upload/startup-files',
  DELETE_FILE = '/upload/{file_key}',



  // Product related endpoints
  GET_PRODUCTS = '/api/products',
  GET_PRODUCT_BY_ID = '/api/products/:id',
  CREATE_PRODUCT = '/api/products/create',
  UPDATE_PRODUCT = '/api/products/update',
  DELETE_PRODUCT = '/api/products/delete',

  // Order related endpoints
  GET_ORDERS = '/api/orders',
  GET_ORDER_BY_ID = '/api/orders/:id',
  CREATE_ORDER = '/api/orders/create',
  UPDATE_ORDER = '/api/orders/update',
  CANCEL_ORDER = '/api/orders/cancel',

  // Dashboard endpoints
  GET_ANALYTICS = '/api/dashboard/analytics',
  GET_STATISTICS = '/api/dashboard/statistics',

  // Settings endpoints
  GET_SETTINGS = '/api/settings',
  UPDATE_SETTINGS = '/api/settings/update'
}

