import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, SparklesIcon } from './IconComponents';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  repoContext: string;
  onSendMessage: (message: string) => Promise<string>;
}

export const Chat: React.FC<ChatProps> = ({ isOpen, onClose, repoName, repoContext, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI assistant for **${repoName}**. Ask me anything about this repository - features, setup, code structure, or how to use it!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full ${isExpanded ? 'w-full sm:w-[800px]' : 'w-full sm:w-[480px]'} bg-slate-950 border-l border-slate-800 z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(236, 72, 153, 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg">
                <SparklesIcon className="h-5 w-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">AI Assistant</h3>
                <p className="text-xs text-slate-400">{repoName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isExpanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative group">
                  <div
                    className={`${isExpanded ? 'max-w-[90%]' : 'max-w-[85%]'} rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                        : 'bg-slate-900/80 backdrop-blur-sm text-slate-200 border border-slate-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose-chat text-sm">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            code: ({node, inline, className, children, ...props}) => {
                              return inline ? (
                                <code className="inline-code" {...props}>{children}</code>
                              ) : (
                                <pre className="code-block">
                                  <code className={className} {...props}>{children}</code>
                                </pre>
                              );
                            },
                            img: ({node, ...props}) => (
                              <img 
                                {...props} 
                                className="chat-image"
                                loading="lazy"
                              />
                            ),
                            table: ({node, ...props}) => (
                              <div className="table-wrapper">
                                <table {...props} />
                              </div>
                            ),
                            h1: ({node, ...props}) => <h1 className="chat-h1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="chat-h2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="chat-h3" {...props} />,
                            ul: ({node, ...props}) => <ul className="chat-ul" {...props} />,
                            ol: ({node, ...props}) => <ol className="chat-ol" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="chat-blockquote" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200 shadow-lg border border-slate-700"
                    title="Copy message"
                  >
                    {copiedIndex === idx ? (
                      <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
              >
                <SparklesIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .prose-chat { 
          color: #f1f5f9; 
          line-height: 1.7;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-chat p { margin-bottom: 0.75em; }
        .prose-chat p:last-child { margin-bottom: 0; }
        .prose-chat strong { color: #ffffff; font-weight: 600; }
        .prose-chat em { color: #fbbf24; font-style: italic; }
        .prose-chat a { 
          color: #f472b6; 
          text-decoration: underline;
          transition: color 0.2s;
        }
        .prose-chat a:hover { color: #ec4899; }
        
        /* Inline code */
        .prose-chat .inline-code { 
          background-color: rgba(55, 65, 81, 0.6); 
          color: #fbbf24; 
          padding: 0.2em 0.5em; 
          border-radius: 4px; 
          font-size: 0.9em;
          font-family: 'Monaco', 'Courier New', monospace;
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        
        /* Code blocks */
        .prose-chat .code-block { 
          background-color: rgba(15, 23, 42, 0.8); 
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 8px; 
          padding: 1em; 
          overflow-x: auto; 
          margin: 0.75em 0;
          font-size: 0.875em;
        }
        .prose-chat .code-block code {
          color: #e2e8f0;
          font-family: 'Monaco', 'Courier New', monospace;
          line-height: 1.5;
        }
        
        /* Images */
        .prose-chat .chat-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.75em 0;
          border: 1px solid rgba(71, 85, 105, 0.3);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        
        /* Tables */
        .prose-chat .table-wrapper {
          overflow-x: auto;
          margin: 0.75em 0;
          border-radius: 8px;
          border: 1px solid rgba(71, 85, 105, 0.5);
        }
        .prose-chat table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875em;
          background-color: rgba(15, 23, 42, 0.5);
        }
        .prose-chat th, .prose-chat td {
          border: 1px solid rgba(71, 85, 105, 0.5);
          padding: 0.5em 0.75em;
          text-align: left;
        }
        .prose-chat th {
          background-color: rgba(55, 65, 81, 0.6);
          font-weight: 600;
          color: #ffffff;
        }
        .prose-chat tr:hover {
          background-color: rgba(55, 65, 81, 0.3);
        }
        
        /* Lists */
        .prose-chat .chat-ul, .prose-chat .chat-ol { 
          margin: 0.75em 0; 
          padding-left: 1.75em; 
        }
        .prose-chat li { 
          margin-bottom: 0.5em; 
          line-height: 1.6;
        }
        .prose-chat li:last-child { margin-bottom: 0; }
        .prose-chat .chat-ul { list-style-type: disc; }
        .prose-chat .chat-ol { list-style-type: decimal; }
        
        /* Headings */
        .prose-chat .chat-h1, .prose-chat .chat-h2, .prose-chat .chat-h3 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        .prose-chat .chat-h1 { 
          font-size: 1.5em; 
          border-bottom: 2px solid rgba(244, 114, 182, 0.3);
          padding-bottom: 0.3em;
        }
        .prose-chat .chat-h2 { 
          font-size: 1.25em;
          border-bottom: 1px solid rgba(244, 114, 182, 0.2);
          padding-bottom: 0.25em;
        }
        .prose-chat .chat-h3 { font-size: 1.1em; }
        
        /* Blockquotes */
        .prose-chat .chat-blockquote {
          border-left: 3px solid #f472b6;
          padding-left: 1em;
          margin: 0.75em 0;
          color: #cbd5e1;
          font-style: italic;
          background-color: rgba(244, 114, 182, 0.05);
          padding: 0.75em 1em;
          border-radius: 4px;
        }
        
        /* Horizontal rule */
        .prose-chat hr {
          border: none;
          border-top: 1px solid rgba(71, 85, 105, 0.5);
          margin: 1em 0;
        }
      `}</style>
    </>
  );
};
