import { GoogleGenAI } from "@google/genai";

export type LLMProvider = 'gemini' | 'groq' | 'openai';

interface LLMResponse {
  text: string;
}

// Runtime API keys (from localStorage)
let runtimeKeys = {
  gemini: localStorage.getItem('GEMINI_API_KEY') || undefined,
  groq: localStorage.getItem('GROQ_API_KEY') || undefined,
  openai: localStorage.getItem('OPENAI_API_KEY') || undefined
};

export const setApiKeys = (keys: { gemini?: string; groq?: string; openai?: string }) => {
  if (keys.gemini) {
    localStorage.setItem('GEMINI_API_KEY', keys.gemini);
    runtimeKeys.gemini = keys.gemini;
  } else {
    localStorage.removeItem('GEMINI_API_KEY');
    runtimeKeys.gemini = undefined;
  }
  
  if (keys.groq) {
    localStorage.setItem('GROQ_API_KEY', keys.groq);
    runtimeKeys.groq = keys.groq;
  } else {
    localStorage.removeItem('GROQ_API_KEY');
    runtimeKeys.groq = undefined;
  }
  
  if (keys.openai) {
    localStorage.setItem('OPENAI_API_KEY', keys.openai);
    runtimeKeys.openai = keys.openai;
  } else {
    localStorage.removeItem('OPENAI_API_KEY');
    runtimeKeys.openai = undefined;
  }
};

export const getApiKeys = () => ({ ...runtimeKeys });

const getApiKey = (provider: LLMProvider): string | undefined => {
  // Check runtime keys first (from localStorage), then env vars
  switch (provider) {
    case 'gemini':
      return runtimeKeys.gemini || process.env.GEMINI_API_KEY;
    case 'groq':
      return runtimeKeys.groq || process.env.GROQ_API_KEY;
    case 'openai':
      return runtimeKeys.openai || process.env.OPENAI_API_KEY;
  }
};

const getAvailableProvider = (): { provider: LLMProvider; apiKey: string } | null => {
  const geminiKey = getApiKey('gemini');
  if (geminiKey) return { provider: 'gemini', apiKey: geminiKey };
  
  const groqKey = getApiKey('groq');
  if (groqKey) return { provider: 'groq', apiKey: groqKey };
  
  const openaiKey = getApiKey('openai');
  if (openaiKey) return { provider: 'openai', apiKey: openaiKey };
  
  return null;
};

const callGemini = async (prompt: string, apiKey: string, schema?: any): Promise<LLMResponse> => {
  const ai = new GoogleGenAI({ apiKey });
  const config: any = { responseMimeType: "application/json" };
  if (schema) config.responseSchema = schema;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config
  });
  return { text: response.text };
};

const callGroq = async (prompt: string, apiKey: string): Promise<LLMResponse> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON.' }],
      temperature: 0.7
    })
  });
  
  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
  const data = await response.json();
  return { text: data.choices[0].message.content };
};

const callOpenAI = async (prompt: string, apiKey: string): Promise<LLMResponse> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON.' }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
  });
  
  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return { text: data.choices[0].message.content };
};

export const generateContent = async (prompt: string, schema?: any): Promise<string> => {
  const config = getAvailableProvider();
  if (!config) throw new Error("No API key configured. Please configure at least one API key in settings.");
  
  const { provider, apiKey } = config;
  
  try {
    let response: LLMResponse;
    switch (provider) {
      case 'gemini':
        response = await callGemini(prompt, apiKey, schema);
        break;
      case 'groq':
        response = await callGroq(prompt, apiKey);
        break;
      case 'openai':
        response = await callOpenAI(prompt, apiKey);
        break;
    }
    return response.text;
  } catch (error) {
    throw new Error(`${provider} API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getActiveProvider = (): LLMProvider | null => {
  const config = getAvailableProvider();
  return config?.provider || null;
};
