import { GoogleGenerativeAI } from '@google/generative-ai';

// Raw import of local RAG knowledge files using Vite's ?raw feature
import heartKnowledge from '../data/heart.md?raw';
import hospitalKnowledge from '../data/hospital.md?raw';
import generalKnowledge from '../data/general_medical.md?raw';
import emergencyKnowledge from '../data/emergency.md?raw';

const KNOWLEDGE_BASES = {
  heart: heartKnowledge,
  hospital: hospitalKnowledge,
  general_medical: generalKnowledge,
  emergency: emergencyKnowledge
};

export async function validateApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { isValid: false, error: 'API key cannot be blank.' };
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    let result;
    
    try {
      // Attempt validation using the modern standard gemini-2.5-flash first
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Ping' }] }],
        generationConfig: { maxOutputTokens: 10 }
      });
    } catch (error) {
      console.warn('Gemini 2.5 validation failed, attempting 1.5 flash fallback...', error);
      // Fallback to gemini-1.5-flash if gemini-2.5-flash isn't available/supported on this key
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Ping' }] }],
        generationConfig: { maxOutputTokens: 10 }
      });
    }
    
    const text = result.response.text();
    if (text && text.trim().length > 0) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Empty response received from diagnostic intelligence service.' };
  } catch (error) {
    console.error('API Key validation failed:', error);
    
    // Clean up generic network errors to be extremely readable
    let friendlyMessage = error.message || 'Connection failed.';
    if (friendlyMessage.includes('API_KEY_INVALID') || friendlyMessage.includes('key is invalid')) {
      friendlyMessage = 'The API key provided is invalid. Please double-check for typos or missing characters.';
    } else if (friendlyMessage.includes('API key not found')) {
      friendlyMessage = 'API key was not found or is inactive. Please ensure it is fully activated in Google AI Studio.';
    } else if (friendlyMessage.includes('User location is not supported')) {
      friendlyMessage = 'Gemini services are not supported in your current region. Please connect via a supported network or VPN.';
    }
    
    return { isValid: false, error: friendlyMessage };
  }
}

/**
 * Scans the user message for cardiovascular emergency phrases.
 * @param {string} message - The user's input
 * @param {string[]} triggers - List of trigger phrases
 * @returns {boolean} - True if an emergency trigger is found
 */
function scanForEmergency(message, triggers) {
  if (!message || !triggers) return false;
  const normalized = message.toLowerCase();
  return triggers.some(trigger => normalized.includes(trigger.toLowerCase()));
}

/**
 * Generates an AI response from Gemini, injecting agent prompts and local RAG context.
 * @param {object} params
 * @param {string} params.apiKey - User's Gemini API key
 * @param {object} params.agent - The selected agent configuration
 * @param {string} params.userMessage - Current user input
 * @param {array} params.chatHistory - Previous messages for conversation context
 * @param {string} params.modelName - The active Gemini model selected
 * @returns {Promise<string>} - The generated AI response
 */
export async function generateAgentResponse({ apiKey, agent, userMessage, chatHistory, modelName }) {
  if (!apiKey) {
    throw new Error('API key is missing. Please configure your Gemini API key in settings.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Support custom selected model, fall back to gemini-2.5-flash which is widely supported and free
  const modelNameUsed = modelName || 'gemini-2.5-flash';

  // Load RAG context
  const knowledgeBaseContent = KNOWLEDGE_BASES[agent.knowledgeBaseFile] || '';

  // Scan for emergency triggers if specific to the Heart Agent
  let emergencyDirective = '';
  if (agent.emergencyTriggers && scanForEmergency(userMessage, agent.emergencyTriggers)) {
    emergencyDirective = `\n\n[CRITICAL SAFETY RED FLAG DETECTED]
The user may be describing emergency cardiovascular symptoms (such as chest pain, breathing difficulty, left arm pain, or cold sweating). 
You MUST IMMEDIATELY trigger your Emergency Triage RED Flag alert at the very beginning of your response. 
State clearly in a prominent bold block that these are serious symptoms and they should call 112 or 108 immediately. 
Prioritize patient safety above all other guidelines. Do not wait until the end to show the warning.`;
  }

  // Compile systemic instructions including agent personality and local RAG data
  const systemInstruction = `
${agent.systemPrompt}

=========================================
LOCAL KNOWLEDGE REFERENCE DATABASE (RAG):
Use the following validated, local medical reference data as the primary source of truth for your explanations:

${knowledgeBaseContent}
=========================================

CRITICAL SAFETY RULES:
- Never diagnose a specific condition. Always guide educational insights.
- Never prescribe medicines, chemicals, or dosages.
- Always include the correct agent-specific disclaimer at the very end of your response.
${emergencyDirective}
`;

  // Initialize model with system instruction
  const model = genAI.getGenerativeModel({
    model: modelNameUsed,
    systemInstruction: systemInstruction
  });

  // Map chat history to Gemini's expected API format
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  // Create chat session
  const chatSession = model.startChat({
    history: formattedHistory,
    generationConfig: {
      temperature: 0.3, // Low temperature for highly precise clinical guidance
      topP: 0.9,
      maxOutputTokens: 2048
    }
  });

  try {
    const result = await chatSession.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error(`Gemini Error: ${error.message || 'An error occurred during response generation. Please check your network connection.'}`);
  }
}

/**
 * Validates a Groq API Key by making a lightweight ping request.
 * @param {string} apiKey - The Groq API key to test
 * @returns {Promise<object>} - Validation status and optional error message
 */
export async function validateGroqApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { isValid: false, error: 'Groq API key cannot be blank.' };
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Ping' }],
        max_tokens: 5
      })
    });
    
    if (response.ok) {
      return { isValid: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status}: Access unauthorized.`;
      return { isValid: false, error: errorMsg };
    }
  } catch (error) {
    console.error('Groq key validation failed:', error);
    return { 
      isValid: false, 
      error: error.message || 'Failed to connect to Groq API. Please check your internet connection.' 
    };
  }
}

/**
 * Generates an AI response from Groq, injecting agent prompts and local RAG context.
 * @param {object} params
 * @param {string} params.apiKey - User's Groq API key
 * @param {object} params.agent - The selected agent configuration
 * @param {string} params.userMessage - Current user input
 * @param {array} params.chatHistory - Previous messages
 * @param {string} params.modelName - The active Groq model selected
 * @returns {Promise<string>} - The generated AI response
 */
export async function generateGroqResponse({ apiKey, agent, userMessage, chatHistory, modelName }) {
  if (!apiKey) {
    throw new Error('Groq API key is missing. Please configure your Groq key in settings.');
  }

  const modelUsed = modelName || 'llama-3.3-70b-versatile';
  const knowledgeBaseContent = KNOWLEDGE_BASES[agent.knowledgeBaseFile] || '';

  // Scan for cardiovascular emergency symptoms
  let emergencyDirective = '';
  if (agent.emergencyTriggers && scanForEmergency(userMessage, agent.emergencyTriggers)) {
    emergencyDirective = `\n\n[CRITICAL SAFETY RED FLAG DETECTED]
The user may be describing emergency cardiovascular symptoms (such as chest pain, breathing difficulty, left arm pain, or cold sweating). 
You MUST IMMEDIATELY trigger your Emergency Triage RED Flag alert at the very beginning of your response. 
State clearly in a prominent bold block that these are serious symptoms and they should call 112 or 108 immediately. 
Prioritize patient safety above all other guidelines. Do not wait until the end to show the warning.`;
  }

  const systemInstruction = `
${agent.systemPrompt}

=========================================
LOCAL KNOWLEDGE REFERENCE DATABASE (RAG):
Use the following validated, local medical reference data as the primary source of truth for your explanations:

${knowledgeBaseContent}
=========================================

CRITICAL SAFETY RULES:
- Never diagnose a specific condition. Always guide educational insights.
- Never prescribe medicines, chemicals, or dosages.
- Always include the correct agent-specific disclaimer at the very end of your response.
${emergencyDirective}
`;

  // Compile prompt message stream in OpenAI standard JSON format
  const messages = [
    { role: 'system', content: systemInstruction }
  ];

  // Append history
  chatHistory.forEach(msg => {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  });

  // Append user's new message
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: messages,
        temperature: 0.3, // Low temperature for highly precise diagnostics
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Groq Service Error: ${errorMsg}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    throw new Error('Invalid format returned by Groq AI endpoint.');
  } catch (error) {
    console.error('Groq generation call failed:', error);
    throw new Error(`Groq Generation Error: ${error.message || 'Failed to complete query.'}`);
  }
}
