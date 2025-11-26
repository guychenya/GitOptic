import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
      <style>{`
        @keyframes flip3d {
          0%, 100% { transform: perspective(800px) rotateY(0deg) rotateX(0deg); }
          25% { transform: perspective(800px) rotateY(180deg) rotateX(0deg); }
          50% { transform: perspective(800px) rotateY(180deg) rotateX(180deg); }
          75% { transform: perspective(800px) rotateY(0deg) rotateX(180deg); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6)); }
          50% { filter: drop-shadow(0 0 40px rgba(236, 72, 153, 0.9)); }
        }
        .flip-animation {
          animation: flip3d 3s ease-in-out infinite;
        }
        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="relative flex flex-col items-center">
        <div className="absolute h-40 w-40 rounded-full bg-pink-500/20 blur-3xl animate-pulse"></div>
        <div className="flip-animation glow-animation">
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20C144.183 20 180 55.8172 180 100C180 144.183 144.183 180 100 180C55.8172 180 20 144.183 20 100C20 55.8172 55.8172 20 100 20Z" fill="url(#gradient1)"/>
            <path d="M70 80C70 72.268 76.268 66 84 66H116C123.732 66 130 72.268 130 80V95H70V80Z" fill="white"/>
            <circle cx="85" cy="85" r="8" fill="#1a1a1a"/>
            <circle cx="115" cy="85" r="8" fill="#1a1a1a"/>
            <path d="M75 110C75 105.582 78.582 102 83 102H117C121.418 102 125 105.582 125 110V130C125 134.418 121.418 138 117 138H83C78.582 138 75 134.418 75 130V110Z" fill="white"/>
            <path d="M85 115H95V125H85V115Z M105 115H115V125H105V115Z" fill="#ec4899"/>
            <defs>
              <linearGradient id="gradient1" x1="20" y1="20" x2="180" y2="180">
                <stop offset="0%" stopColor="#ec4899"/>
                <stop offset="50%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="mt-8 text-lg font-medium text-white tracking-widest animate-pulse">ANALYZING...</p>
      </div>
    </div>
  );
};