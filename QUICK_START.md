# Quick Start Guide - Multi-LLM Support

## 🎯 What You Need
At least **ONE** API key from these providers:

### Option 1: Google Gemini (FREE) ⭐ Recommended
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to `.env.local`: `GEMINI_API_KEY=your_key_here`

### Option 2: Groq (FREE)
1. Visit: https://console.groq.com/keys
2. Sign up and create an API key
3. Copy the key
4. Add to `.env.local`: `GROQ_API_KEY=your_key_here`

### Option 3: OpenAI (PAID)
1. Visit: https://platform.openai.com/api-keys
2. Create an API key (requires payment method)
3. Copy the key
4. Add to `.env.local`: `OPENAI_API_KEY=your_key_here`

## 🚀 Setup (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Add your API key to .env.local
# (Copy .env.local.example if needed)
echo "GEMINI_API_KEY=your_key_here" >> .env.local

# 3. Run the app
npm run dev
```

## 🔍 How It Works

The app automatically uses the **first available** API key in this order:
1. Gemini (if GEMINI_API_KEY exists)
2. Groq (if GROQ_API_KEY exists)
3. OpenAI (if OPENAI_API_KEY exists)

You can add multiple keys for redundancy!

## 💡 Pro Tips

- **Use Gemini or Groq** for free usage
- **Add multiple keys** for automatic fallback
- **Check console** to see which provider is active
- **No code changes needed** - just add/remove keys in `.env.local`

## ❓ Troubleshooting

### "No API key configured" error
→ Add at least one API key to `.env.local`

### "Invalid API key" error
→ Check your key is correct and has no extra spaces

### "API quota exceeded" error
→ Try a different provider or wait for quota reset

## 📚 More Info

- Full changes: See `IMPROVEMENTS.md`
- Technical details: See `CHANGES.md`
- Setup instructions: See `README.md`

---

**That's it!** Get an API key, add it to `.env.local`, and run `npm run dev`. 🎉
