// Define an enum for API endpoints
export enum ApiEndpoint {
  // User related endpoints
  GET_USER = 'users/me',
  UPDATE_USER = '/api/user/update',
  DELETE_USER = '/api/user/delete',

  // Authentication endpoints
  LOGIN = 'users/login/access-token',
  REGISTER = 'users/register',
  LOGOUT = '/api/auth/logout',
  FORGOT_PASSWORD = '/api/auth/forgot-password',
  RESET_PASSWORD = '/api/auth/reset-password',

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

// Usage example:
// fetch(ApiEndpoint.GET_PRODUCTS)
//   .then(response => response.json())
//   .then(data => console.log(data));
