import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Mic, MicOff, X, Sparkles, Navigation, MapPin, 
  Coffee, BookOpen, Clock, AlertTriangle, ShieldCheck, Volume2, 
  VolumeX, FileText, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { campusStore } from '../services/campusStore';
import { ragKnowledgeEngine, RAGSearchResult } from '../services/ragKnowledgeBase';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  action?: {
    type: 'navigate' | 'link';
    label: string;
    target: string;
  };
  citations?: {
    docTitle: string;
    section: string;
    ordinanceRef?: string;
    matchedSnippet: string;
    confidenceScore: number;
  }[];
  timestamp: string;
}

export function AICampusCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: 'Namaskar! I am your Sathaye AI Campus Copilot & Voice Assistant. How can I assist you today? You can speak or ask about ATKT ordinances, 75% attendance rules, placement eligibility, today\'s timetable, meal tokens, or campus rooms.',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUser = campusStore.getCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Voice Speech Synthesis (Spoken responses like Alexa / Google Assistant)
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks or special symbols
      const cleanText = text.replace(/[*_#`[\]]/g, '').slice(0, 220);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-IN';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  // Web Speech API Voice Recognition (Voice Assistant Input)
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput('What are the ATKT rules for autonomous B.Sc. IT?');
      return;
    }

    if (isListening) {
      setIsListening(false);
      window.speechSynthesis?.cancel();
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(transcript);
        };
        recognition.start();
      } catch (err) {
        setIsListening(false);
        setInput('What are the ATKT rules?');
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Safeguard: Check if student asks for unauthorized actions
    const lower = query.toLowerCase();
    if (lower.includes('unlock room') || lower.includes('open door') || lower.includes('private number') || lower.includes('phone number of teacher') || lower.includes('change grade') || lower.includes('change attendance')) {
      setTimeout(() => {
        setIsTyping(false);
        const reply = 'I am not authorized to perform administrative overrides, share private staff contact numbers, or unlock campus facilities directly. Please visit the Central Administration Office (Room 002, Ground Floor) or submit a formal ticket via the Support & Helpdesk portal.';
        setMessages(prev => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: reply,
            action: {
              type: 'link',
              label: 'Open Campus Support Desk',
              target: '/support'
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakText(reply);
      }, 500);
      return;
    }

    // Step 1: Check RAG Knowledge Base for regulatory college questions
    const isRagQuery = lower.includes('atkt') || lower.includes('rule') || lower.includes('attendance') ||
                       lower.includes('75%') || lower.includes('grade') || lower.includes('grading') ||
                       lower.includes('ordinance') || lower.includes('placement') || lower.includes('ctc') ||
                       lower.includes('dream job') || lower.includes('hall ticket') || lower.includes('borrow') ||
                       lower.includes('fine') || lower.includes('ragging');

    if (isRagQuery) {
      setTimeout(() => {
        setIsTyping(false);
        const ragResult: RAGSearchResult = ragKnowledgeEngine.search(query);
        const botMsg: Message = {
          id: 'bot-rag-' + Date.now(),
          sender: 'bot',
          text: ragResult.answer,
          citations: ragResult.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        speakText(ragResult.answer);
      }, 600);
      return;
    }

    // Step 2: Try Backend Chat API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userRole: currentUser?.role || 'STUDENT',
          userEmail: currentUser?.email || 'student@sathaye.edu'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsTyping(false);
        const reply = data.reply || 'Here is the relevant information from Sathaye Campus records.';
        setMessages(prev => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: reply,
            action: data.action,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakText(reply);
        return;
      }
    } catch (e) {
      console.warn('[Copilot Server Fallback]:', e);
    }

    // Step 3: Grounded heuristic navigation replies
    setIsTyping(false);
    let replyText = '';
    let action: Message['action'] = undefined;

    if (lower.includes('next class') || lower.includes('lecture') || lower.includes('timetable')) {
      replyText = 'Your upcoming class is "Core Java USIT401" in IT Lab 1 with Prof. S. Rane.';
      action = {
        type: 'navigate',
        label: 'View Room on Campus Map',
        target: '/map?target=m-it-lab-1'
      };
    } else if (lower.includes('204') || lower.includes('room 204')) {
      replyText = 'Smart Classroom 204 is situated on the 2nd Floor of the Main Academic Block with wheelchair elevator access.';
      action = {
        type: 'navigate',
        label: 'Locate Room 204 on Map',
        target: '/map?target=m-204'
      };
    } else if (lower.includes('canteen') || lower.includes('food') || lower.includes('meal')) {
      replyText = 'The Student Canteen is active with pre-ordering meal tokens. Token counter pickup queue is currently normal.';
      action = {
        type: 'link',
        label: 'Open Smart Canteen Order',
        target: '/canteen'
      };
    } else if (lower.includes('vault') || lower.includes('certificate') || lower.includes('marksheet')) {
      replyText = 'Your official academic certificates and 75%+ attendance records are cryptographically verified in the Blockchain Vault.';
      action = {
        type: 'link',
        label: 'Open Credential Vault',
        target: '/vault'
      };
    } else {
      replyText = `Regarding "${query}", you can view live schedules, meal orders, placement drives, or campus navigation directly in your Sathaye UCM portal.`;
    }

    setMessages(prev => [
      ...prev,
      {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: replyText,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    speakText(replyText);
  };

  const handleActionClick = (action?: Message['action']) => {
    if (!action) return;
    if (action.type === 'navigate' || action.type === 'link') {
      navigate(action.target);
      setIsOpen(false);
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: 'm-init',
        sender: 'bot',
        text: 'Conversation cleared. How may I assist you with Sathaye College services?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#003366] hover:bg-[#002244] text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-yellow-400 group transition-all transform hover:scale-105"
          aria-label="Open AI Campus Copilot"
        >
          <div className="relative">
            <Bot size={24} className="text-yellow-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#003366] animate-pulse"></span>
          </div>
          <span className="font-bold text-xs uppercase tracking-wider pr-1 hidden sm:inline">
            Voice & AI Copilot
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] sm:w-[410px] h-[550px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="bg-[#003366] text-white p-3.5 flex items-center justify-between border-b-2 border-yellow-400">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-yellow-400/40">
                <Bot size={18} className="text-yellow-300" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Sathaye Voice Copilot</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] px-1.5 py-0.2 rounded font-mono">
                    RAG Grounded
                  </span>
                </div>
                <div className="text-[10px] text-blue-200">
                  {currentUser ? `${currentUser.role} Mode • ${currentUser.name}` : 'Student & Visitor Voice Skill'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  const next = !isSpeechEnabled;
                  setIsSpeechEnabled(next);
                  if (!next) window.speechSynthesis?.cancel();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeechEnabled ? 'text-yellow-300 bg-white/10' : 'text-gray-400 hover:text-white'
                }`}
                title={isSpeechEnabled ? 'Mute voice audio output' : 'Enable voice speech audio'}
              >
                {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white px-2 py-1 text-[11px] rounded transition-colors"
                title="Clear Chat History"
              >
                Clear
              </button>

              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="text-gray-300 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#003366] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}

                  {/* RAG Citations Box */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5">
                      <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
                        <FileText size={11} className="mr-1 text-yellow-600" />
                        Verified Regulatory Sources (RAG Citations)
                      </div>
                      {m.citations.map((c, idx) => (
                        <div key={idx} className="bg-yellow-50/70 p-2 rounded-lg border border-yellow-200/60 text-[10px]">
                          <div className="flex items-center justify-between font-bold text-[#003366]">
                            <span>{c.ordinanceRef || c.section}</span>
                            <span className="text-emerald-700 font-mono text-[9px]">{c.confidenceScore}% Match</span>
                          </div>
                          <p className="text-gray-600 text-[9px] mt-0.5">{c.docTitle}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Action Button */}
                  {m.action && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center space-x-1 border border-blue-200"
                      >
                        <Navigation size={12} />
                        <span>{m.action.label}</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1 text-gray-400 text-xs p-2 bg-white rounded-xl border border-gray-200 w-28">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] ml-1 font-semibold">Synthesizing</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Active Audio Wave Indicator */}
          {isListening && (
            <div className="bg-red-600 text-white px-3 py-2 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center space-x-2">
                <Mic size={15} />
                <span className="font-extrabold uppercase text-[11px]">Listening for speech query...</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1 h-3 bg-white animate-ping"></span>
                <span className="w-1 h-4 bg-white animate-ping [animation-delay:0.1s]"></span>
                <span className="w-1 h-2 bg-white animate-ping [animation-delay:0.2s]"></span>
              </div>
            </div>
          )}

          {/* Quick Query Voice Chips */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex space-x-1.5 overflow-x-auto text-[10px] scrollbar-none">
            {[
              'What are the ATKT rules?',
              '75% attendance policy',
              'Placement eligibility',
              'Where is Room 204?',
              'Canteen meal tokens'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-50 text-gray-700 hover:text-[#003366] rounded-full whitespace-nowrap transition-colors border border-gray-200 font-semibold"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-1.5">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-xl transition-colors ${
                isListening ? 'bg-red-600 text-white animate-pulse' : 'text-gray-500 hover:text-[#003366] hover:bg-gray-100'
              }`}
              title="Click to speak (Voice Assistant mode)"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask by voice or type (e.g. ATKT, rooms)..."
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#003366]"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-[#003366] hover:bg-[#002244] text-yellow-400 p-2 rounded-xl disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default AICampusCopilot;
