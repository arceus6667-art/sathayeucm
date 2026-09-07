import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, X, Sparkles, Navigation, MapPin, Coffee, BookOpen, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { campusStore } from '../services/campusStore';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  action?: {
    type: 'navigate' | 'link';
    label: string;
    target: string;
  };
  timestamp: string;
}

export function AICampusCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: 'Namaskar! I am your Sathaye AI Campus Copilot. How can I assist you today? Ask me about classrooms, today\'s timetable, canteen meal tokens, library books, or 2D floor plans.',
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

  // Voice recognition support
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput('Where is Room 204?');
      return;
    }

    if (isListening) {
      setIsListening(false);
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
        setInput('Where is Room 204?');
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

    // Safeguard: Check if student asks for unauthorized actions (private staff contact, arbitrary room unlock)
    const lower = query.toLowerCase();
    if (lower.includes('unlock room') || lower.includes('open door') || lower.includes('private number') || lower.includes('phone number of teacher') || lower.includes('change grade') || lower.includes('change attendance')) {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: 'I am not authorized to perform administrative overrides, share private staff contact numbers, or unlock campus facilities directly. Please visit the Central Administration Office (Room 002, Ground Floor) or submit a formal ticket via the Support & Helpdesk portal.',
            action: {
              type: 'link',
              label: 'Open Campus Support Desk',
              target: '/support'
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // Call server API for grounded answers & Gemini AI
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
        setMessages(prev => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: data.reply || 'Here is the relevant information from Sathaye Campus records.',
            action: data.action,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }
    } catch (e) {
      console.warn('[Copilot Server Fallback]:', e);
    }

    // Fallback grounded answer
    setIsTyping(false);
    let replyText = '';
    let action: Message['action'] = undefined;

    if (lower.includes('next class') || lower.includes('lecture') || lower.includes('timetable')) {
      replyText = 'Your upcoming class is "Python Practical Lab" in Room 201 (Floor 2) with Prof. Rohan Desai.';
      action = {
        type: 'navigate',
        label: 'View Room 201 on 2D Map',
        target: '/map?target=room-201'
      };
    } else if (lower.includes('204') || lower.includes('room 204')) {
      replyText = 'Lecture Room 204 is situated on the 2nd Floor of the Main Academic Block. It has smart interactive boards and wheelchair elevator access.';
      action = {
        type: 'navigate',
        label: 'Locate Room 204 on Map',
        target: '/map?target=m-204'
      };
    } else if (lower.includes('canteen') || lower.includes('food')) {
      replyText = 'The Student Canteen is located in the Ground Floor Cafeteria Pavilion. You can browse the daily menu and pre-order meal tokens online.';
      action = {
        type: 'link',
        label: 'Open Smart Canteen',
        target: '/canteen'
      };
    } else if (lower.includes('library') || lower.includes('book')) {
      replyText = 'The Central Library & Knowledge Resource Center is on the 1st Floor. Reading seats and textbook borrowing are open.';
      action = {
        type: 'link',
        label: 'Open Smart Library',
        target: '/library'
      };
    } else {
      replyText = 'I am your Sathaye AI Copilot. You can ask me to find any classroom (e.g. Room 204), check your timetable, verify canteen meal tokens, or navigate between floors on our 2D floor plans.';
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
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    navigate(action.target);
    setIsOpen(false);
  };

  const clearChat = () => {
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
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#003366] hover:bg-[#002244] text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 border-2 border-amber-400 group transition-all transform hover:scale-105"
          aria-label="Open AI Campus Copilot"
        >
          <div className="relative">
            <Bot size={24} className="text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#003366] animate-pulse"></span>
          </div>
          <span className="font-bold text-xs uppercase tracking-wider pr-1 hidden sm:inline">
            Campus AI Copilot
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="bg-[#003366] text-white p-3.5 flex items-center justify-between border-b-2 border-amber-400">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-amber-400/40">
                <Bot size={18} className="text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Sathaye Campus Copilot</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] px-1.5 py-0.2 rounded font-mono">
                    Grounded AI
                  </span>
                </div>
                <div className="text-[10px] text-blue-200">
                  {currentUser ? `${currentUser.role} Mode • ${currentUser.name}` : 'Student & Visitor Guide'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white p-1 text-[11px] rounded transition-colors"
                title="Clear Chat History"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
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
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#003366] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.text}

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
              <div className="flex items-center space-x-1 text-gray-400 text-xs p-2 bg-white rounded-xl border border-gray-200 w-24">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] ml-1">Thinking</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Chips */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex space-x-1.5 overflow-x-auto text-[10px]">
            {[
              'Where is Room 204?',
              'Next lecture?',
              'Canteen menu',
              'Library seats',
              'Principal Office'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-[#003366] rounded-full whitespace-nowrap transition-colors border border-gray-200 font-medium"
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
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Speak voice query"
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about classes, rooms, fests..."
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-[#003366] hover:bg-[#002244] text-white p-2 rounded-xl disabled:opacity-40 transition-colors"
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
