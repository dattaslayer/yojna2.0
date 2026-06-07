import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Bot, Loader2, RefreshCw } from 'lucide-react';
import { CitizenProfile, Scheme, Message } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: CitizenProfile | null;
  currentScheme?: Scheme | null;
}

const CHIP_SUGGESTIONS = [
  "Can I apply if my income is zero?",
  "What if I don't have an Aadhaar Card?",
  "How long does the approval take?",
  "Tell me about agricultural benefits"
];

const SCHEME_SPECIFIC_SUGGESTIONS: { [key: string]: string[] } = {
  pmay: [
    "What is a 'pucca house'?",
    "Is co-ownership with mother allowed?",
    "Can single men apply for PMAY?"
  ],
  pmkisan: [
    "I own 1.5 hectares, am I eligible?",
    "My name belongs to joint family land registry, can I apply?",
    "How is the ₹6,000 paid?"
  ],
  ayushman: [
    "Which private hospitals are empaneled?",
    "Does this cover diagnostics?",
    "Is senior citizen age limit applicable?"
  ],
  scholarship: [
    "What if my college is outside my home State?",
    "Can post-graduate students apply?",
    "Is there a minimum mark criteria?"
  ],
  jaljeevan: [
    "Is tap water connection free under JJM?",
    "What if my area has water scarcity?"
  ]
};

export default function AiAssistant({ isOpen, onClose, userProfile, currentScheme }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      triggerInitialGreeting();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerInitialGreeting = async () => {
    setMessages([
      {
        id: 'greet',
        sender: 'assistant',
        text: `Namaste${userProfile?.name ? `, ${userProfile.name}` : ''}! 🙏 I am **Yojna Saathi**, your personal AI assistant. 
        
I am here to help you navigate India's central and state welfare benefits with ease. ${currentScheme ? `I see you are interested in the **${currentScheme.title}**. Ask me any question about its benefits, eligibility, or application process!` : 'Based on your profile, I can advise you on matching schemes! Feel free to ask me anything.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    setErrorMsg(null);
    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile,
          currentScheme
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reach assistant backend.");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `m-${Date.now()}-assistant`,
        sender: 'assistant',
        text: data.text || "I was unable to formulate a response. Please try reframing your question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Something went wrong. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = () => {
    if (currentScheme && SCHEME_SPECIFIC_SUGGESTIONS[currentScheme.id]) {
      return SCHEME_SPECIFIC_SUGGESTIONS[currentScheme.id];
    }
    return CHIP_SUGGESTIONS;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 transform translate-x-0">
        
        {/* Header */}
        <header className="bg-primary text-white p-4 flex justify-between items-center border-b border-primary-container shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Bot className="text-secondary-fixed w-5 h-5" />
            </div>
            <div>
              <h2 id="ai-assistant-title" className="font-headline font-bold text-base leading-tight">Yojna Saathi</h2>
              <p className="text-[11px] text-primary-fixed-dim flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-secondary-fixed fill-secondary-fixed anim-pulse" /> Active AI Guidance
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 px-2.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* Current Context Banner */}
        {currentScheme && (
          <div className="bg-surface-container-low px-4 py-2 text-xs border-b border-outline-variant flex gap-2 items-center shrink-0">
            <span className="font-semibold text-primary">Context:</span>
            <span className="text-on-surface-variant truncate font-medium">{currentScheme.title}</span>
          </div>
        )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-outline-variant/10">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white text-on-surface border border-outline-variant rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {/* Simplistic formatting support: Bold text with ** */}
                  {msg.text.split('**').map((chunk, idx) => 
                    idx % 2 === 1 ? <strong key={idx} className="font-bold underline decoration-secondary decoration-2">{chunk}</strong> : chunk
                  )}
                </div>
                <div className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-primary-fixed-dim/80' : 'text-on-surface-variant/70'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-outline-variant rounded-2xl rounded-bl-none p-4 shadow-xs flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-on-surface-variant font-medium">Yojna Saathi is typing...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-error-container text-on-error-container border border-error/20 rounded-xl p-3 text-xs leading-relaxed">
              <p className="font-bold mb-1">Service Notice</p>
              <p className="text-on-error-container/80">{errorMsg}</p>
              <button 
                onClick={() => setMessages([])} 
                className="mt-2 text-error font-semibold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Reset Conversation
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input/Suggestion Footing */}
        <div className="p-3 border-t border-outline-variant bg-white shrink-0">
          
          {/* Quick suggestions */}
          <div className="mb-3">
            <span className="text-[11px] text-on-surface-variant font-semibold block mb-1.5 px-1">Suggested Questions</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
              {getSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="text-xs font-semibold text-primary bg-primary-container/20 border border-primary-container/30 hover:bg-primary-container/40 px-2.5 py-1.5 rounded-lg text-left transition-colors active:scale-95 duration-100 disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Text area input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your welfare question here..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-surface border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all h-10"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 bg-primary text-white rounded-xl shadow-md hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-center text-on-surface-variant/80 mt-1.5 font-medium">NIC Maintained Digital Assistant • Replies can verify under actual state laws.</p>
        </div>

      </div>
    </div>
  );
}
