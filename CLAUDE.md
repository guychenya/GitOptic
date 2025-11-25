# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Live Demo:** [Deployed on Netlify](https://showgithubrepo.netlify.app)

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server 
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

## Environment Setup

This app requires at least one API key in `.env.local`:
- `GEMINI_API_KEY` - Google Gemini (Free, Recommended)
- `GROQ_API_KEY` - Groq (Free)
- `OPENAI_API_KEY` - OpenAI (Paid)

The app automatically uses the first available key in priority order: Gemini → Groq → OpenAI

## Architecture

This is a React TypeScript application built with Vite that analyzes GitHub repositories using multiple LLM providers.

### Core Components
- **App.tsx** - Main application component containing all state management and UI routing
- **llm-service.ts** - LLM provider abstraction layer with automatic fallback
- **RepoSearchForm** - Search input for finding GitHub repositories
- **SearchResults** - Displays search results with analyze buttons
- **ReadmeModal** - Modal for displaying README content with full content loading
- Various utility components (ErrorMessage, LoadingIndicator, IconComponents, etc.)

### Key Features
- GitHub repository search using AI
- Multi-LLM provider support (Gemini, Groq, OpenAI)
- Automatic provider fallback
- Real-time repository analysis fetching live stats from GitHub API
- Code quality analysis with scoring gauges
- README content display with full loading capability
- Similar tools discovery
- Responsive design with animated UI elements

### Data Flow
1. User searches for repositories via AI-powered search
2. Results are displayed with analyze options
3. When analyzing, the app fetches real GitHub API data for accuracy
4. AI provides qualitative analysis (description, features, tech stack, code quality)
5. Additional similar tools can be loaded dynamically

### State Management
All state is managed in the main App component using React hooks. No external state management library is used.

### Styling
Uses Tailwind CSS classes with custom CSS for markdown rendering and wave animations. The design features a dark theme with pink/orange gradients.

### API Integration
- **GitHub API** - Real repository statistics and metadata
- **Google Gemini** - AI analysis (model: gemini-2.5-flash)
- **Groq** - AI analysis (model: llama-3.3-70b-versatile)
- **OpenAI** - AI analysis (model: gpt-4o-mini)
- Environment variables accessed via Vite config