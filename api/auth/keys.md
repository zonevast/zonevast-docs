# API Keys Documentation

## Overview

API keys are used to authenticate your application when making requests to ZoneVast services. Each API key is unique to your application and should be kept secure.

## Getting API Keys

### From Developer Portal

1. Log in to the [ZoneVast Developer Portal](https://test.zonevast.com)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy and securely store your API key

### Key Types

- **Production Key**: For live environments
- **Development Key**: For testing and development
- **Sandbox Key**: For sandbox testing environment

## Using API Keys in Requests

API keys should be included in the `X-API-Key` header of your HTTP requests.

### cURL Example

```bash
curl -X GET https://test.zonevast.com/api/v1/auth/users/ \
  -H "X-API-Key: your_api_key_here"
```

### JavaScript Example

```javascript
const response = await fetch('https://test.zonevast.com/api/v1/auth/users/', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Axios Example

```javascript
import axios from 'axios';

const response = await axios.get('https://test.zonevast.com/api/v1/auth/users/', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
});

console.log(response.data);
```

## Best Practices

### Security

- **Never** expose API keys in client-side code (browsers, mobile apps)
- **Always** store API keys in environment variables
- **Never** commit API keys to version control
- Use **different keys** for development, staging, and production

### Environment Variables

```bash
# .env file
VITE_API_KEY=your_api_key_here
```

```javascript
// Access in JavaScript
const apiKey = import.meta.env.VITE_API_KEY;
```

### Key Rotation

- Rotate API keys regularly (recommended: every 90 days)
- If a key is compromised, revoke it immediately
- Have a grace period when rotating keys in production

## Rate Limits

API keys are subject to rate limits:

- **Development**: 100 requests/minute
- **Production**: 1000 requests/minute
- **Enterprise**: Custom limits

When limits are exceeded, you'll receive a `429 Too Many Requests` response.

## Key Revocation

If you need to revoke an API key:

1. Go to **Settings** → **API Keys**
2. Find the key you want to revoke
3. Click **Revoke**
4. Confirm the action

**Note**: Revoked keys cannot be recovered. You'll need to generate a new key.

## Troubleshooting

### Common Errors

**401 Unauthorized**
- Check that your API key is valid
- Ensure the key hasn't been revoked
- Verify you're using the correct environment key

**403 Forbidden**
- Your key may not have permission for this endpoint
- Check your key's scope and permissions

**429 Too Many Requests**
- You've exceeded the rate limit
- Implement exponential backoff in your application

### Testing Your Key

```bash
# Test your API key
curl -X GET https://test.zonevast.com/api/v1/auth/health/ \
  -H "X-API-Key: your_api_key_here"
```

## Support

For issues with API keys, contact:
- Email: support@zonevast.com
- Documentation: https://docs.zonevast.com
