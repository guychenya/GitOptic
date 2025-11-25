# BYOK (Bring Your Own Key) Feature

## Overview

The GitOptic now supports **in-app API key configuration**, allowing users to configure their LLM provider API keys directly in the browser without editing environment files.

## How It Works

### User Experience

1. **Open the app** - No API keys required initially
2. **Click Settings (⚙️)** - Located in the top-right corner
3. **Enter API keys** - Add one or more provider keys
4. **Save** - Keys are stored in browser's localStorage
5. **Start using** - App automatically uses configured keys

### Security

- **Local storage only** - Keys are stored in your browser's localStorage
- **Never sent to servers** - Keys only go to the respective AI provider APIs
- **Client-side only** - No backend server involved
- **User controlled** - You can clear keys anytime

## Supported Providers

### Google Gemini (Free)
- Get key: https://aistudio.google.com/app/apikey
- Model: gemini-2.5-flash
- Best for: General use, free tier

### Groq (Free)
- Get key: https://console.groq.com/keys
- Model: llama-3.3-70b-versatile
- Best for: Fast inference, free tier

### OpenAI (Paid)
- Get key: https://platform.openai.com/api-keys
- Model: gpt-4o-mini
- Best for: High quality, requires payment

## Priority Order

The app uses keys in this order:
1. Gemini (if configured)
2. Groq (if configured)
3. OpenAI (if configured)

You can configure multiple keys for automatic fallback.

## Technical Implementation

### localStorage Keys
- `GEMINI_API_KEY` - Gemini API key
- `GROQ_API_KEY` - Groq API key
- `OPENAI_API_KEY` - OpenAI API key

### Code Structure

**llm-service.ts**
- Checks localStorage first, then environment variables
- `setApiKeys()` - Save keys to localStorage
- `getApiKeys()` - Retrieve current keys
- `getActiveProvider()` - Determine which provider to use

**ApiKeyConfig.tsx**
- Modal component for key configuration
- Password input fields for security
- Links to get API keys
- Save/cancel functionality

**App.tsx**
- Settings button in header
- State management for modal
- Integration with llm-service

## Benefits

### For Users
- ✅ No need to edit files
- ✅ No server restart required
- ✅ Works on deployed apps
- ✅ Easy to switch providers
- ✅ Try the app without setup

### For Developers
- ✅ Easier onboarding
- ✅ Works in production
- ✅ No backend needed
- ✅ User-managed keys
- ✅ Reduced support burden

## Usage Examples

### First-time User
```
1. Visit app → See "No API key configured" message
2. Click Settings → Enter Gemini key (free)
3. Click Save → Start using immediately
```

### Power User
```
1. Click Settings
2. Add all three provider keys
3. Enjoy automatic fallback if one fails
```

### Switching Providers
```
1. Click Settings
2. Remove current key
3. Add different provider key
4. App automatically switches
```

## Clearing Keys

To remove stored keys:
1. Click Settings
2. Clear the input fields
3. Click Save

Or manually:
```javascript
localStorage.removeItem('GEMINI_API_KEY');
localStorage.removeItem('GROQ_API_KEY');
localStorage.removeItem('OPENAI_API_KEY');
```

## Environment Variables Still Work

The traditional `.env.local` approach still works:
- Environment variables are checked as fallback
- Useful for development
- Good for server deployments

Priority: localStorage → environment variables

## Privacy & Security

### What's Stored
- Only API keys in localStorage
- No personal information
- No usage data

### What's Sent
- API keys only to respective providers
- Repository data to AI providers for analysis
- GitHub API calls for repo stats

### What's NOT Stored
- No server-side storage
- No analytics
- No tracking

## Troubleshooting

**Keys not working after save**
- Refresh the page
- Check console for errors
- Verify key format is correct

**Keys disappeared**
- Check if localStorage was cleared
- Browser privacy mode doesn't persist
- Re-enter keys if needed

**Want to use env vars instead**
- Just don't configure keys in Settings
- Add to `.env.local` file
- Restart dev server

## Future Enhancements

Potential improvements:
- [ ] Show which provider is active
- [ ] Test keys before saving
- [ ] Import/export key configuration
- [ ] Key validation
- [ ] Usage statistics
- [ ] Provider health status
