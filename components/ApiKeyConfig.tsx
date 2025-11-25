import React, { useState } from 'react';
import { XMarkIcon, KeyIcon, CheckCircleIcon } from './IconComponents';

interface ApiKeyConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: { gemini?: string; groq?: string; openai?: string }) => void;
  currentKeys: { gemini?: string; groq?: string; openai?: string };
}

export const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ isOpen, onClose, onSave, currentKeys }) => {
  const [geminiKey, setGeminiKey] = useState(currentKeys.gemini || '');
  const [groqKey, setGroqKey] = useState(currentKeys.groq || '');
  const [openaiKey, setOpenaiKey] = useState(currentKeys.openai || '');
  const [saved, setSaved] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<{
    gemini?: boolean;
    groq?: boolean;
    openai?: boolean;
  }>({});

  const validateGeminiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const validateGroqKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const validateOpenAIKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleValidate = async (provider: 'gemini' | 'groq' | 'openai') => {
    setValidating(provider);
    let isValid = false;

    try {
      switch (provider) {
        case 'gemini':
          if (geminiKey) isValid = await validateGeminiKey(geminiKey);
          break;
        case 'groq':
          if (groqKey) isValid = await validateGroqKey(groqKey);
          break;
        case 'openai':
          if (openaiKey) isValid = await validateOpenAIKey(openaiKey);
          break;
      }
    } catch {
      isValid = false;
    }

    setValidationResults(prev => ({ ...prev, [provider]: isValid }));
    setValidating(null);
  };

  const handleSave = () => {
    onSave({
      gemini: geminiKey.trim() || undefined,
      groq: groqKey.trim() || undefined,
      openai: openaiKey.trim() || undefined
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <KeyIcon className="h-6 w-6 text-pink-500" />
            Configure API Keys
          </h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Google Gemini API Key <span className="text-green-400">(Free)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setValidationResults(prev => ({ ...prev, gemini: undefined }));
                }}
                placeholder="AIza..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => handleValidate('gemini')}
                disabled={!geminiKey || validating === 'gemini'}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                {validating === 'gemini' ? 'Validating...' : 'Validate'}
              </button>
            </div>
            {validationResults.gemini !== undefined && (
              <p className={`text-xs mt-1 ${validationResults.gemini ? 'text-green-400' : 'text-red-400'}`}>
                {validationResults.gemini ? '✓ Valid API key' : '✗ Invalid API key'}
              </p>
            )}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:underline mt-1 inline-block">
              Get your key →
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Groq API Key <span className="text-green-400">(Free)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={groqKey}
                onChange={(e) => {
                  setGroqKey(e.target.value);
                  setValidationResults(prev => ({ ...prev, groq: undefined }));
                }}
                placeholder="gsk_..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => handleValidate('groq')}
                disabled={!groqKey || validating === 'groq'}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                {validating === 'groq' ? 'Validating...' : 'Validate'}
              </button>
            </div>
            {validationResults.groq !== undefined && (
              <p className={`text-xs mt-1 ${validationResults.groq ? 'text-green-400' : 'text-red-400'}`}>
                {validationResults.groq ? '✓ Valid API key' : '✗ Invalid API key'}
              </p>
            )}
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:underline mt-1 inline-block">
              Get your key →
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              OpenAI API Key <span className="text-yellow-400">(Paid)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setValidationResults(prev => ({ ...prev, openai: undefined }));
                }}
                placeholder="sk-..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => handleValidate('openai')}
                disabled={!openaiKey || validating === 'openai'}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
              >
                {validating === 'openai' ? 'Validating...' : 'Validate'}
              </button>
            </div>
            {validationResults.openai !== undefined && (
              <p className={`text-xs mt-1 ${validationResults.openai ? 'text-green-400' : 'text-red-400'}`}>
                {validationResults.openai ? '✓ Valid API key' : '✗ Invalid API key'}
              </p>
            )}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:underline mt-1 inline-block">
              Get your key →
            </a>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-300">
            <strong className="text-white">Note:</strong> Keys are stored in your browser's local storage and never sent to any server except the respective AI provider.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                Saved!
              </>
            ) : (
              'Save Keys'
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
