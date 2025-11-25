# GitHub Project Analyzer

Analyze any GitHub repository instantly with AI-powered insights. Get comprehensive information about tech stack, code quality, features, and similar tools.

## 🌐 Live Demo

Try the deployed version: [GitHub Project Analyzer](https://showgithubrepo.netlify.app)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- At least one API key from the supported providers below

### Quick Setup

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd ShowGitHubRepo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get an API key** (choose at least one):
   
   - **Google Gemini** (FREE, Recommended)
     - Visit: https://aistudio.google.com/app/apikey
     - Click "Create API Key"
     - Copy your key
   
   - **Groq** (FREE)
     - Visit: https://console.groq.com/keys
     - Sign up and create an API key
     - Copy your key
   
   - **OpenAI** (Paid)
     - Visit: https://platform.openai.com/api-keys
     - Create an API key
     - Copy your key

4. **Configure your API key**
   
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your key(s):
   ```bash
   # Add at least one of these:
   GEMINI_API_KEY=your_gemini_key_here
   GROQ_API_KEY=your_groq_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```

5. **Start the app**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to: http://localhost:5173

## 🎯 How to Use

1. **Search for repositories**: Enter a topic (e.g., "react", "machine learning", "web framework")
2. **Select a repository**: Click "Analyze" on any result
3. **View insights**: Get detailed analysis including:
   - Project summary and key features
   - Technology stack
   - Code quality scores
   - Setup instructions
   - Similar tools and alternatives

## 🤖 Supported LLM Providers

The app supports multiple AI providers with automatic fallback:

| Provider | Cost | Speed | Quality |
|----------|------|-------|---------|
| **Google Gemini** | Free | Fast | Excellent |
| **Groq** | Free | Very Fast | Good |
| **OpenAI** | Paid | Fast | Excellent |

**Priority order**: Gemini → Groq → OpenAI (uses first available API key)

💡 **Tip**: Add multiple API keys for automatic fallback if one provider has issues!

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (via inline styles)
- **Build Tool**: Vite
- **AI Providers**: Google Gemini, Groq, OpenAI
- **APIs**: GitHub REST API for real-time stats
- **Markdown**: react-markdown with GitHub Flavored Markdown

## 📝 Features

- 🔍 AI-powered repository search
- 📊 Real-time GitHub stats (stars, forks, issues)
- 🎯 Code quality analysis with scores
- 📚 README viewer with full content loading
- 🔗 Similar tools recommendations
- 🎨 Beautiful, responsive UI with dark theme
- ⚡ Fast and lightweight
- 🔄 Automatic LLM provider fallback

## 🏗️ Architecture

### Core Components
- **App.tsx** - Main application with state management and routing
- **llm-service.ts** - LLM provider abstraction layer
- **RepoSearchForm** - Search input component
- **SearchResults** - Display search results
- **ReadmeModal** - Full README content viewer
- **IconComponents** - Reusable icon library

### Data Flow
1. User searches for repositories via AI-powered search
2. Results displayed with analyze options
3. Real-time GitHub API data fetched for accuracy
4. AI provides qualitative analysis (description, features, tech stack, code quality)
5. Additional similar tools loaded dynamically on demand

### State Management
All state managed in App component using React hooks. No external state management library required.

## 📦 Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## ❓ Troubleshooting

**"No API key configured" error**
- Make sure you created `.env.local` file
- Add at least one API key
- Restart the dev server (`npm run dev`)

**"Invalid API key" error**
- Check your API key is correct
- Remove any extra spaces
- Verify the key is active on the provider's dashboard

**Build errors**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall
- Check Node.js version (should be v16+)

**App not loading**
- Check console for errors
- Verify `.env.local` file exists and has at least one API key
- Make sure you're on http://localhost:5173

## 📄 License

This project is for educational purposes.

## 👤 Author

Made with ❤️ by [Guy Chenya](https://www.guyc.dev)
