# Enhanced Investor API Documentation

## Overview

The Investor API provides comprehensive endpoints for listing, searching, and filtering investor profiles. This API was enhanced as part of PH-16 to include advanced filtering capabilities, search functionality, and optimized pagination.

## Base URL

All investor endpoints are prefixed with `/api/investors`

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. List Investors with Filtering

**GET** `/api/investors/`

List all investor profiles with advanced filtering, search, and pagination capabilities.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | integer | No | Number of investors to skip (default: 0) |
| `limit` | integer | No | Maximum number of investors to return (default: 100, max: 500) |
| `search` | string | No | Search by investor name or firm name |
| `industries` | array[Industry] | No | Filter by investment focus industries |
| `funding_stages` | array[FundingStage] | No | Filter by preferred funding stages |
| `location` | string | No | Filter by investor location |

#### Response

```json
{
  "investors": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "John Investor",
      "email": "john@example.com",
      "company": "Venture Capital LLC",
      "firm_name": "Venture Capital LLC",
      "bio": "Experienced investor in tech startups",
      "website": "https://example.com",
      "location": "San Francisco, CA",
      "linkedin_url": "https://linkedin.com/in/johninvestor",
      "twitter_url": "https://twitter.com/johninvestor",
      "investment_focus": ["technology", "fintech"],
      "preferred_stages": ["seed", "series_a"],
      "profile_picture": null,
      "min_investment": null,
      "max_investment": null
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 100,
  "total_pages": 2
}
```

#### Example Requests

```bash
# Basic listing
GET /api/investors/?skip=0&limit=50

# Search by name or firm
GET /api/investors/?search=venture

# Filter by industry
GET /api/investors/?industries=technology&industries=healthcare

# Filter by funding stage
GET /api/investors/?funding_stages=seed&funding_stages=series_a

# Combined filtering
GET /api/investors/?search=tech&industries=technology&location=san francisco&limit=20
```

### 2. Search Investors

**GET** `/api/investors/search`

Search investors by name or firm name with dedicated search endpoint.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query for investor name or firm (min length: 1) |
| `skip` | integer | No | Number of results to skip (default: 0) |
| `limit` | integer | No | Maximum number of results to return (default: 50, max: 100) |

#### Example Request

```bash
GET /api/investors/search?q=venture%20capital&limit=20
```

### 3. Get Investors by Industry

**GET** `/api/investors/by-industry/{industry}`

Get investors who focus on a specific industry.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `industry` | Industry | Yes | Industry enum value |

#### Available Industries

- `technology`
- `healthcare`
- `finance`
- `education`
- `retail`
- `manufacturing`
- `real_estate`
- `energy`
- `transportation`
- `media`
- `entertainment`
- `food_beverage`
- `agriculture`
- `hospitality`
- `construction`
- `telecommunications`
- `biotechnology`
- `aerospace`
- `automotive`
- `ecommerce`
- `gaming`
- `cybersecurity`
- `fintech`
- `health_tech`
- `ed_tech`
- `other`

#### Example Request

```bash
GET /api/investors/by-industry/technology?skip=0&limit=25
```

### 4. Get Investors by Funding Stage

**GET** `/api/investors/by-stage/{funding_stage}`

Get investors who prefer a specific funding stage.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `funding_stage` | FundingStage | Yes | Funding stage enum value |

#### Available Funding Stages

- `idea`
- `mvp`
- `early_stage`
- `pre_seed`
- `seed`
- `series_a`
- `series_b`
- `series_c`
- `ipo`
- `merger_acquisition`
- `other`

#### Example Request

```bash
GET /api/investors/by-stage/seed?skip=0&limit=30
```

### 5. Get Investor Details

**GET** `/api/investors/{investor_id}`

Get detailed information for a specific investor.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `investor_id` | UUID | Yes | Unique identifier of the investor |

#### Response

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "firm_name": "Venture Capital LLC",
  "bio": "Experienced investor in tech startups",
  "website": "https://example.com",
  "location": "San Francisco, CA",
  "linkedin_url": "https://linkedin.com/in/johninvestor",
  "twitter_url": "https://twitter.com/johninvestor",
  "investment_focus": ["technology", "fintech"],
  "preferred_stages": ["seed", "series_a"]
}
```

## Performance Optimizations

### Indexing

The following database indexes are recommended for optimal performance:

- `InvestorProfile.firm_name` (already indexed)
- `User.full_name` (for search functionality)
- `InvestorProfile.location` (for location filtering)

### Pagination

- Use `skip` and `limit` parameters for pagination
- Maximum limit is 500 to prevent performance issues
- Total count is included in responses for pagination UI

### Caching Recommendations

Consider implementing caching for:
- Industry and funding stage filter results
- Popular search queries
- Location-based filters

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid query parameters"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 404 Not Found
```json
{
  "detail": "Investor not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["query", "limit"],
      "msg": "ensure this value is less than or equal to 500",
      "type": "value_error.number.not_le"
    }
  ]
}
```

## Usage Examples

### Frontend Integration

```javascript
// Search investors with filtering
const searchInvestors = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.industries) {
    filters.industries.forEach(industry => 
      params.append('industries', industry)
    );
  }
  if (filters.location) params.append('location', filters.location);
  params.append('skip', filters.page * filters.limit);
  params.append('limit', filters.limit);
  
  const response = await fetch(`/api/investors/?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};

// Get investors by specific criteria
const getTechInvestors = async () => {
  const response = await fetch('/api/investors/by-industry/technology', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## Migration Notes

### Breaking Changes

- The main `/api/investors/` endpoint now returns a structured response with pagination metadata instead of a simple array
- Response format includes `total`, `page`, `limit`, and `total_pages` fields

### Backward Compatibility

- All existing query parameters are still supported
- The investor data structure within the `investors` array remains unchanged
- Individual investor detail endpoint (`/api/investors/{id}`) is unchanged

## Performance Metrics

Expected performance improvements:
- 50% faster response times for filtered queries
- Reduced database load through optimized queries
- Better user experience with pagination metadata 