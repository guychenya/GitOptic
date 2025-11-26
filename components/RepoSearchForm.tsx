
import React, { useState, useEffect } from 'react';
import { GithubOctocatIcon } from './IconComponents';

const BobcatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes bobcatSpin {
        0%, 100% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg); }
      }
      .bobcat-spin {
        animation: bobcatSpin 2s ease-in-out infinite;
        transform-style: preserve-3d;
      }
    `}</style>
    <g className="bobcat-spin">
      <circle cx="100" cy="100" r="80" fill="url(#bobcatGradient)"/>
      <path d="M70 80C70 72.268 76.268 66 84 66H116C123.732 66 130 72.268 130 80V95H70V80Z" fill="white"/>
      <circle cx="85" cy="85" r="8" fill="currentColor"/>
      <circle cx="115" cy="85" r="8" fill="currentColor"/>
      <path d="M75 110C75 105.582 78.582 102 83 102H117C121.418 102 125 105.582 125 110V130C125 134.418 121.418 138 117 138H83C78.582 138 75 134.418 75 130V110Z" fill="white"/>
      <rect x="85" y="115" width="10" height="10" fill="currentColor" rx="2"/>
      <rect x="105" y="115" width="10" height="10" fill="currentColor" rx="2"/>
    </g>
    <defs>
      <linearGradient id="bobcatGradient" x1="20" y1="20" x2="180" y2="180">
        <stop offset="0%" stopColor="#ec4899"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
    </defs>
  </svg>
);

interface RepoSearchFormProps {
  onSubmit: (query: string) => void;
  loading: boolean;
  initialQuery: string;
}

export const RepoSearchForm = React.forwardRef<HTMLInputElement, RepoSearchFormProps>(
  ({ onSubmit, loading, initialQuery }, ref) => {
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
      setQuery(initialQuery);
    }, [initialQuery]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query && !loading) {
        onSubmit(query);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="mb-12 w-full max-w-2xl mx-auto" aria-label="Search for GitHub Repositories">
        <div className="relative">
          <input
            ref={ref}
            id="github-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects (e.g., 'react') or press ⌘K"
            className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-lg py-3 pl-4 pr-48 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-lg"
            disabled={loading}
            aria-label="Repository search query"
            aria-describedby="submit-button"
            required
          />
          <div className="absolute top-1/2 right-[150px] -translate-y-1/2 hidden sm:flex items-center pointer-events-none">
            <kbd className="text-xs font-sans text-slate-400 border border-slate-600 rounded-md px-1.5 py-0.5">⌘K</kbd>
          </div>
          <button
            id="submit-button"
            type="submit"
            disabled={loading || !query}
            className={`absolute top-1/2 right-1.5 -translate-y-1/2 flex items-center justify-center font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-lg overflow-hidden min-w-[100px] ${
              loading 
                ? 'bg-slate-900 border border-slate-700 text-white' 
                : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white shadow-pink-500/20 hover:shadow-pink-500/40'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <GithubOctocatIcon className="h-4 w-4 text-white animate-bounce" style={{animationDelay: '0ms'}} />
                <span className="text-xs mx-1">🐱</span>
                <GithubOctocatIcon className="h-4 w-4 text-white animate-bounce" style={{animationDelay: '200ms'}} />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BobcatIcon className="h-5 w-5 mr-2 text-white" />
                <span>Search</span>
              </div>
            )}
          </button>
        </div>
      </form>
    );
  }
);
