import React, { createContext, useContext, useState, useEffect } from 'react';
import { agents } from '../data/agents';
import { 
  validateApiKey, 
  validateGroqApiKey, 
  generateAgentResponse, 
  generateGroqResponse 
} from '../services/gemini';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Load API keys independently from localStorage
  const [geminiKey, setGeminiKey] = useState(() => {
    return localStorage.getItem('medi_ai_gemini_key') || localStorage.getItem('medi_ai_key') || '';
  });
  const [groqKey, setGroqKey] = useState(() => {
    return localStorage.getItem('medi_ai_groq_key') || '';
  });

  // Active Provider: 'gemini' | 'groq'
  const [apiProvider, setApiProvider] = useState(() => {
    return localStorage.getItem('medi_ai_provider') || 'gemini';
  });

  // Active Models per provider
  const [activeGeminiModel, setActiveGeminiModel] = useState(() => {
    return localStorage.getItem('medi_ai_gemini_model') || 'gemini-2.5-flash';
  });
  const [activeGroqModel, setActiveGroqModel] = useState(() => {
    return localStorage.getItem('medi_ai_groq_model') || 'llama-3.3-70b-versatile';
  });

  // Computed active credentials and model configs
  const apiKey = apiProvider === 'gemini' ? geminiKey : groqKey;
  const activeModel = apiProvider === 'gemini' ? activeGeminiModel : activeGroqModel;

  // API validation status: 'idle' | 'validating' | 'valid' | 'invalid'
  const [apiStatus, setApiStatus] = useState(() => {
    const provider = localStorage.getItem('medi_ai_provider') || 'gemini';
    const key = provider === 'groq' 
      ? localStorage.getItem('medi_ai_groq_key')
      : (localStorage.getItem('medi_ai_gemini_key') || localStorage.getItem('medi_ai_key'));
    return key ? 'valid' : 'idle';
  });

  const [apiError, setApiError] = useState('');

  // Selected AI agent, defaults to null (shows Selector Hub on load)
  const [activeAgent, setActiveAgent] = useState(null);

  // Chat histories per agent ID, persisted in localStorage
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('medi_ai_chats');
    if (savedChats) {
      try {
        return JSON.parse(savedChats);
      } catch (e) {
        console.error('Failed to parse saved chats:', e);
      }
    }
    // Default initial empty state for all agents
    const initial = {};
    agents.forEach(agent => {
      initial[agent.id] = [];
    });
    return initial;
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(!apiKey);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync chats to localStorage
  useEffect(() => {
    localStorage.setItem('medi_ai_chats', JSON.stringify(chats));
  }, [chats]);

  // Validate API key on mount if key exists
  useEffect(() => {
    if (apiKey && apiStatus === 'idle') {
      const verify = async () => {
        setApiStatus('validating');
        const result = apiProvider === 'gemini'
          ? await validateApiKey(apiKey)
          : await validateGroqApiKey(apiKey);
        if (result.isValid) {
          setApiStatus('valid');
          setApiError('');
        } else {
          setApiStatus('invalid');
          setApiError(result.error || 'Saved API key verification failed.');
        }
      };
      verify();
    }
  }, [apiKey, apiStatus, apiProvider]);

  /**
   * Save API Key and trigger verification.
   * @param {string} key - The API Credentials
   * @param {string} provider - The active provider context
   */
  const handleSaveApiKey = async (key, provider = apiProvider) => {
    setApiStatus('validating');
    setApiError('');
    const result = provider === 'gemini'
      ? await validateApiKey(key)
      : await validateGroqApiKey(key);
      
    if (result.isValid) {
      if (provider === 'gemini') {
        localStorage.setItem('medi_ai_gemini_key', key);
        setGeminiKey(key);
      } else {
        localStorage.setItem('medi_ai_groq_key', key);
        setGroqKey(key);
      }
      setApiStatus('valid');
      setApiError('');
      setIsApiKeyModalOpen(false);
      return { success: true };
    } else {
      setApiStatus('invalid');
      setApiError(result.error);
      return { success: false, error: result.error };
    }
  };

  /**
   * Clears/removes the stored API key for the active provider.
   */
  const handleRemoveApiKey = () => {
    if (apiProvider === 'gemini') {
      localStorage.removeItem('medi_ai_gemini_key');
      localStorage.removeItem('medi_ai_key');
      setGeminiKey('');
    } else {
      localStorage.removeItem('medi_ai_groq_key');
      setGroqKey('');
    }
    setApiStatus('idle');
    setApiError('');
  };

  /**
   * Dynamically toggles between Gemini and Groq systems.
   * @param {string} provider - 'gemini' | 'groq'
   */
  const handleSetApiProvider = (provider) => {
    localStorage.setItem('medi_ai_provider', provider);
    setApiProvider(provider);
    
    const key = provider === 'gemini' ? geminiKey : groqKey;
    setApiStatus(key ? 'valid' : 'idle');
    setApiError('');
    
    // Open modal if no credentials configured for this system
    if (!key) {
      setIsApiKeyModalOpen(true);
    } else {
      setIsApiKeyModalOpen(false);
    }
  };

  /**
   * Sets the active model for the active provider context.
   * @param {string} model - The model code
   */
  const handleSetActiveModel = (model) => {
    if (apiProvider === 'gemini') {
      localStorage.setItem('medi_ai_gemini_model', model);
      setActiveGeminiModel(model);
    } else {
      localStorage.setItem('medi_ai_groq_model', model);
      setActiveGroqModel(model);
    }
  };

  /**
   * Clears chat history for a specific agent.
   * @param {string} agentId - The ID of the agent
   */
  const clearChat = (agentId) => {
    setChats(prev => ({
      ...prev,
      [agentId]: []
    }));
  };

  /**
   * Appends user message and requests/streams the AI response.
   * @param {string} messageText - The user message text
   */
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Append user message to active agent's history
    const currentAgentId = activeAgent.id;
    setChats(prev => ({
      ...prev,
      [currentAgentId]: [...(prev[currentAgentId] || []), userMsg]
    }));

    setIsAiLoading(true);

    try {
      // 2. Fetch full chat history for prompt context (limit to last 10 messages for token efficiency)
      const currentHistory = chats[currentAgentId] || [];
      const limitedHistory = currentHistory.slice(-10);

      // 3. Request generation from appropriate provider
      const aiResponse = apiProvider === 'gemini'
        ? await generateAgentResponse({
            apiKey,
            agent: activeAgent,
            userMessage: messageText,
            chatHistory: limitedHistory,
            modelName: activeModel
          })
        : await generateGroqResponse({
            apiKey,
            agent: activeAgent,
            userMessage: messageText,
            chatHistory: limitedHistory,
            modelName: activeModel
          });

      // 4. Simulate a premium "typing/streaming" appearance by appending parts over time
      simulateStreamingResponse(aiResponse, currentAgentId);

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errMsg = {
        id: `msg-${Date.now()}-ai-error`,
        sender: 'ai',
        text: `⚠️ **Diagnostic Interrupt**: ${error.message || 'Unable to connect to healthcare intelligence services. Please verify your API key and network connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setChats(prev => ({
        ...prev,
        [currentAgentId]: [...(prev[currentAgentId] || []), errMsg]
      }));
      setIsAiLoading(false);
    }
  };

  /**
   * Simulates a streaming word-by-word effect for high-fidelity interactive feel.
   * @param {string} fullText - The completed AI response
   * @param {string} agentId - The active agent identifier
   */
  const simulateStreamingResponse = (fullText, agentId) => {
    const aiMsgId = `msg-${Date.now()}-ai`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add an initial placeholder message in the chat
    const placeholderMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp,
      isStreaming: true
    };

    setChats(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), placeholderMsg]
    }));

    setIsAiLoading(false);

    // Stream by blocks/chunks of words
    const words = fullText.split(' ');
    let currentText = '';
    let wordIndex = 0;
    
    // Adjust speeds: typing speed of ~15-25ms per word feels very high-end and responsive
    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        setChats(prev => {
          const agentHistory = prev[agentId] || [];
          return {
            ...prev,
            [agentId]: agentHistory.map(msg => 
              msg.id === aiMsgId ? { ...msg, text: currentText } : msg
            )
          };
        });
        wordIndex++;
      } else {
        clearInterval(interval);
        // Mark streaming as finished
        setChats(prev => {
          const agentHistory = prev[agentId] || [];
          return {
            ...prev,
            [agentId]: agentHistory.map(msg => 
              msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
            )
          };
        });
      }
    }, 20);
  };

  /**
   * Utility to copy message text to clipboard safely.
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AppContext.Provider
      value={{
        apiKey,
        apiStatus,
        apiError,
        apiProvider,
        setApiProvider: handleSetApiProvider,
        activeModel,
        setActiveModel: handleSetActiveModel,
        geminiKey,
        groqKey,
        activeAgent,
        setActiveAgent,
        chats,
        sendMessage,
        clearChat,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        isAiLoading,
        saveApiKey: handleSaveApiKey,
        removeApiKey: handleRemoveApiKey,
        copyToClipboard
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
