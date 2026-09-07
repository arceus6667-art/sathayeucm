import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, X, Sparkles, Navigation, MapPin, Coffee, BookOpen, Clock, AlertTriangle, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SmartCampusStore } from '../smartCampusStore';
import { CAMPUS_LOCATIONS, STUDENT_TIMETABLE } from '../smartCampusData';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: 'Namaskar! I am your Sathaye AI Campus Copilot. How can I help you today? Ask me about classrooms, your next lecture, canteen orders, events, or navigation.',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUser = SmartCampusStore.getCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice recognition support
  const toggleVoice = () => {
    // Check if webkitSpeechRecognition or SpeechRecognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback voice simulation
      setInput('Where is my next class?');
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

  const handleSend = (textToSend?: string) => {
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

    // Process intelligence response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let replyText = '';
      let action: Message['action'] = undefined;

      // 1. Next class / Schedule
      if (lower.includes('next class') || lower.includes('lecture') || lower.includes('timetable') || lower.includes('where to go')) {
        const nextLec = STUDENT_TIMETABLE[0];
        replyText = `Your next lecture is "${nextLec.subject}" (${nextLec.code}) scheduled at ${nextLec.startTime} in ${nextLec.room} (${nextLec.building}, ${nextLec.floor}). Faculty: ${nextLec.facultyName}.`;
        action = {
          type: 'navigate',
          label: `Navigate to ${nextLec.room} (3 mins walk)`,
          target: `/map?target=${nextLec.locationId}`
        };
      }
      // 2. Room 204
      else if (lower.includes('204') || lower.includes('room 204')) {
        replyText = `Lecture Room 204 is situated on the 2nd Floor of the Main Academic Building. It is equipped with smart projectors and has wheelchair elevator access from the central atrium.`;
        action = {
          type: 'navigate',
          label: 'Show 3D Route to Room 204',
          target: '/map?target=loc-room-204'
        };
      }
      // 3. IT Lab / Computers
      else if (lower.includes('it lab') || lower.includes('lab 1') || lower.includes('computer')) {
        replyText = `IT Laboratory 1 (Advanced Computing) is on the 3rd Floor of the IT & Self-Finance Wing. It has 45 high-end Linux/Docker workstations.`;
        action = {
          type: 'navigate',
          label: 'Navigate to IT Lab 1',
          target: '/map?target=loc-it-lab-1'
        };
      }
      // 4. Library
      else if (lower.includes('library') || lower.includes('book') || lower.includes('reading hall')) {
        replyText = `Sathaye Central Library & Reading Hall is on the 1st Floor of the Knowledge Resource Center. Current reading hall status: 14 seats available on Floor 1.`;
        action = {
          type: 'link',
          label: 'Open Smart Library Desk',
          target: '/library'
        };
      }
      // 5. Canteen
      else if (lower.includes('canteen') || lower.includes('food') || lower.includes('eat') || lower.includes('chai') || lower.includes('misal')) {
        replyText = `The Student Canteen is open on the Ground Floor pavilion. Today's top favorites: Mumbai Special Misal Pav (₹50) and Masala Chai (₹15). Current queue: approx 6-8 minutes.`;
        action = {
          type: 'link',
          label: 'Order Online & Skip the Queue',
          target: '/canteen'
        };
      }
      // 6. Events / Saptarang
      else if (lower.includes('event') || lower.includes('fest') || lower.includes('saptarang') || lower.includes('hackathon')) {
        replyText = `Upcoming highlights: Saptarang 2026 Annual Fest (Oct 15), Sathaye TechSprint 24hr Hackathon (Sept 26), and Inter-Department Cricket Championship. Registrations are open!`;
        action = {
          type: 'link',
          label: 'View Campus Events',
          target: '/events'
        };
      }
      // 7. Medical / Emergency / SOS
      else if (lower.includes('medical') || lower.includes('doctor') || lower.includes('emergency') || lower.includes('sos') || lower.includes('accident') || lower.includes('sick')) {
        replyText = `Campus Health & Medical Center is located on the Ground Floor of Main Academic Building (Room G-04). For immediate assistance, call Security Desk (+91 93213 47772 / Ext 101) or trigger the SOS button.`;
        action = {
          type: 'link',
          label: 'Campus Safety & Emergency Desk',
          target: '/safety'
        };
      }
      // 8. Auditorium
      else if (lower.includes('auditorium') || lower.includes('dhuru')) {
        replyText = `Kashinath Dhuru Auditorium is situated in the Auditorium Complex on the ground level, accommodating 650 seats.`;
        action = {
          type: 'navigate',
          label: 'Navigate to Auditorium',
          target: '/map?target=loc-auditorium'
        };
      }
      // 9. Lost item / Support
      else if (lower.includes('lost') || lower.includes('found') || lower.includes('repair') || lower.includes('broken')) {
        replyText = `You can report lost property or lodge infrastructure maintenance requests (AC, Wi-Fi, projector) on the Campus Support desk. Our AI will automatically find matching found items!`;
        action = {
          type: 'link',
          label: 'Campus Support & Lost & Found',
          target: '/support'
        };
      }
      // 10. Default informative fallback
      else {
        replyText = `I understand your request regarding "${query}". At Sathaye College, all academic schedules, faculty contacts, canteen queues, reading hall seats, and 3D campus routing are accessible via the portal.`;
        action = {
          type: 'link',
          label: 'Explore Student Portal',
          target: '/portal'
        };
      }

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: replyText,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // Readout if TTS is enabled
      const prefs = SmartCampusStore.getAccessibilityPrefs();
      if (prefs.ttsEnabled && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(replyText);
        window.speechSynthesis.speak(utter);
      }
    }, 450);
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    navigate(action.target);
    setIsOpen(false);
  };

  const quickPrompts = [
    'Where is my next class?',
    'Route to Room 204',
    'What is on the Canteen menu?',
    'Library seat availability',
    'Emergency & Medical Room'
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-[#003366] text-yellow-400 hover:bg-[#002244] border-2 border-yellow-500/80 p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            title="Sathaye AI Campus Copilot"
          >
            <Bot size={28} className="text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-500"></span>
            </span>
          </button>
        )}
      </div>

      {/* Copilot Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-[#003366] text-white p-4 flex items-center justify-between border-b border-yellow-500/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-[#003366] flex items-center justify-center font-bold shadow">
                <Bot size={22} />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-base leading-tight">AI Campus Copilot</h3>
                  <span className="bg-yellow-400/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Sathaye
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">Interactive Assistant • Connected to Campus Hub</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/70">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#003366] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Action button if present */}
                  {msg.action && (
                    <button
                      onClick={() => handleActionClick(msg.action)}
                      className="mt-3 w-full flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-[#003366] font-bold text-xs py-2 px-3 rounded-lg shadow transition-colors"
                    >
                      {msg.action.type === 'navigate' ? <Navigation size={14} /> : <MapPin size={14} />}
                      <span>{msg.action.label}</span>
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#003366] rounded-full border border-blue-200 text-[11px] font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-2 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse border-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300'
                }`}
                title="Voice Input (Speech recognition)"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about rooms, classes, food, library..."
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#003366] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#003366] hover:bg-blue-900 disabled:opacity-40 text-yellow-400 p-2 rounded-xl transition-all shadow"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AICampusCopilot;
