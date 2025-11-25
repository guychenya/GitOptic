import { GoogleGenAI } from "@google/genai";

export type LLMProvider = 'gemini' | 'groq' | 'openai';

interface LLMResponse {
  text: string;
}

const getAvailableProvider = (): { provider: LLMProvider; apiKey: string } | null => {
  if (process.env.GEMINI_API_KEY) return { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY };
  if (process.env.GROQ_API_KEY) return { provider: 'groq', apiKey: process.env.GROQ_API_KEY };
  if (process.env.OPENAI_API_KEY) return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY };
  return null;
};

const callGemini = async (prompt: string, schema?: any): Promise<LLMResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not found");
  
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

const callGroq = async (prompt: string): Promise<LLMResponse> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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

const callOpenAI = async (prompt: string): Promise<LLMResponse> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
  if (!config) throw new Error("No API key configured. Please add at least one API key to .env.local");
  
  const { provider } = config;
  
  try {
    let response: LLMResponse;
    switch (provider) {
      case 'gemini':
        response = await callGemini(prompt, schema);
        break;
      case 'groq':
        response = await callGroq(prompt);
        break;
      case 'openai':
        response = await callOpenAI(prompt);
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
