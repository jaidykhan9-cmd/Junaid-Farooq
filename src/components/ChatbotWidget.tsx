import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, CheckCircle2, Phone, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { Booking } from '../types/index.ts';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  bookingInfo?: Partial<Booking>;
}

interface ChatbotWidgetProps {
  onOpenBookingModal: (service?: string) => void;
  onOpenPaymentModal: (bookingId?: string) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  onOpenBookingModal,
  onOpenPaymentModal,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Peace be upon you! I am the automated booking concierge for JD Electrical & Plumbing Services in Mansehra. How can I assist your property today?',
      timestamp: 'Just now',
      quickReplies: [
        '⚡ Electrical Issue',
        '🚰 Plumbing Problem',
        '🛡️ View Maintenance Packages',
        '📅 Book a Technician Now',
        '💳 JazzCash Payment Info',
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [chatBookingState, setChatBookingState] = useState<{
    step: 'idle' | 'category' | 'problem' | 'name' | 'phone' | 'email' | 'address';
    category?: string;
    problem?: string;
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  }>({ step: 'idle' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;
    setInputVal('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Handle Conversational State Machine
    setTimeout(async () => {
      let botResponse: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // If user is currently in interactive chat-booking flow:
      if (chatBookingState.step === 'problem') {
        setChatBookingState((prev) => ({ ...prev, step: 'name', problem: text }));
        botResponse.text = `Thank you. I have noted the problem details: "${text}". Could you please provide your Full Name?`;
        setMessages((prev) => [...prev, botResponse]);
        return;
      }

      if (chatBookingState.step === 'name') {
        setChatBookingState((prev) => ({ ...prev, step: 'phone', name: text }));
        botResponse.text = `Nice to meet you, ${text}. What is your Mobile or WhatsApp contact number?`;
        setMessages((prev) => [...prev, botResponse]);
        return;
      }

      if (chatBookingState.step === 'phone') {
        setChatBookingState((prev) => ({ ...prev, step: 'email', phone: text }));
        botResponse.text = `Got it (${text}). What is your Email address for receiving the official dispatch confirmation?`;
        setMessages((prev) => [...prev, botResponse]);
        return;
      }

      if (chatBookingState.step === 'email') {
        setChatBookingState((prev) => ({ ...prev, step: 'address', email: text }));
        botResponse.text = `Finally, what is your Street Address or Neighborhood in Mansehra?`;
        setMessages((prev) => [...prev, botResponse]);
        return;
      }

      if (chatBookingState.step === 'address') {
        const fullData = {
          ...chatBookingState,
          address: text,
        };
        botResponse.text = 'Registering your booking directly in our PostgreSQL database and dispatching email to jaidykhan9@gmail.com...';
        setMessages((prev) => [...prev, botResponse]);

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: fullData.name,
              phone: fullData.phone,
              email: fullData.email,
              serviceCategory: fullData.category || 'electrical',
              serviceTitle: `${fullData.category === 'plumbing' ? 'Plumbing' : 'Electrical'} Service (Chatbot Dispatch)`,
              problemDescription: `[Submitted via Chatbot]\n${fullData.problem}`,
              preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              preferredTime: 'Morning (9:00 AM - 1:00 PM)',
              address: `${text}, Mansehra, KP, Pakistan`,
            }),
          });

          const resData = await res.json();
          if (res.ok && resData.booking) {
            const b = resData.booking;
            const confirmMsg: Message = {
              id: `b-conf-${Date.now()}`,
              sender: 'bot',
              text: `✅ Success! Your booking is registered.\n\nBooking ID: ${b.bookingId}\nCustomer ID: ${b.customerId}\nStatus: ${b.bookingStatus}\n\nYour booking has been sent directly to JD's team at jaidykhan9@gmail.com. Our engineering technicians will coordinate with you at ${b.phone}.`,
              timestamp: 'Just now',
              quickReplies: ['💬 Open WhatsApp to Confirm', '💳 JazzCash Payment Info', '📞 Call 0302-1822160'],
            };
            setMessages((prev) => [...prev, confirmMsg]);
          } else {
            throw new Error(resData.error || 'Server error');
          }
        } catch (err: any) {
          const errMsg: Message = {
            id: `b-err-${Date.now()}`,
            sender: 'bot',
            text: `We could not complete the automated dispatch: ${err.message}. Please use the main booking modal or call 0302-1822160.`,
            timestamp: 'Just now',
          };
          setMessages((prev) => [...prev, errMsg]);
        }

        setChatBookingState({ step: 'idle' });
        return;
      }

      // Standard conversational keywords
      const lower = text.toLowerCase();

      if (lower.includes('electrical') || text.includes('⚡')) {
        botResponse.text = 'We provide complete electrical engineering: conduit wiring, ATS generator changeovers, breaker distribution boards (Schneider/ABB), and fault diagnostics.\n\nWould you like to book an electrician right now?';
        botResponse.quickReplies = ['Yes, Book Electrical Service', 'Ask about ATS / Solar', 'Call 0302-1822160'];
      } else if (lower.includes('plumbing') || text.includes('🚰')) {
        botResponse.text = 'Our plumbing division handles European concealed sanitary fixtures (Grohe/Geberit), 12-bar hydrostatic tested PPRC piping, booster pumps, and ultrasonic leak detection.\n\nWould you like to book a plumbing specialist?';
        botResponse.quickReplies = ['Yes, Book Plumbing Service', 'Water Pump Issues', 'Call 0302-1822160'];
      } else if (lower.includes('yes, book electrical') || lower.includes('book electrical')) {
        setChatBookingState({ step: 'problem', category: 'electrical' });
        botResponse.text = 'Great! Please describe the electrical issue or project scope you need help with in Mansehra:';
      } else if (lower.includes('yes, book plumbing') || lower.includes('book plumbing')) {
        setChatBookingState({ step: 'problem', category: 'plumbing' });
        botResponse.text = 'Great! Please describe the plumbing problem (e.g. leak, low pressure pump, toilet fixture) in Mansehra:';
      } else if (lower.includes('book') || text.includes('📅')) {
        botResponse.text = 'You can book using our step-by-step interactive application or right here in chat! Which category do you need?';
        botResponse.quickReplies = ['⚡ Book Electrical Service', '🚰 Book Plumbing Service', 'Open Full Booking Application'];
      } else if (lower.includes('open full booking')) {
        onOpenBookingModal();
        botResponse.text = 'I have opened the multi-step booking modal for you on screen.';
      } else if (lower.includes('package') || text.includes('🛡️')) {
        botResponse.text = 'We offer 3 curated preventative maintenance plans:\n1. Mansehra Residence Prime (Rs. 18,500/qtr)\n2. Executive Villa MEP Care (Rs. 38,000/biannual)\n3. Commercial Facility Contract (Rs. 65,000/mo)\n\nAll plans include emergency SLA and scheduled safety audits.';
        botResponse.quickReplies = ['Book Residence Plan', 'Book Villa Plan', 'Open Full Booking Application'];
      } else if (lower.includes('jazzcash') || lower.includes('payment') || text.includes('💳')) {
        botResponse.text = 'JazzCash Payment Details:\nAccount Title: Junaid Farooq\nMobile / Account: 03021822160\n\nOnce paid, you can submit your Transaction ID (TID) in our Payment Verification portal.';
        botResponse.quickReplies = ['Submit Payment Proof', 'Book a Service First', '💬 Message on WhatsApp'];
      } else if (lower.includes('submit payment proof')) {
        onOpenPaymentModal();
        botResponse.text = 'I have launched the JazzCash Payment Submission portal for you.';
      } else if (lower.includes('whatsapp') || text.includes('💬')) {
        window.open('https://wa.me/923021822160?text=Hello%20JD%20Electrical%20%26%20Plumbing%20Services', '_blank');
        botResponse.text = 'Opening WhatsApp to chat directly with CEO Junaid Farooq (+92 302 1822160)...';
      } else if (lower.includes('call') || text.includes('📞')) {
        window.location.href = 'tel:03021822160';
        botResponse.text = 'Connecting your phone to 0302-1822160...';
      } else {
        botResponse.text = 'I can help guide you through electrical issues, plumbing diagnostics, maintenance packages, or book a certified technician directly to your Mansehra home. What would you like to do?';
        botResponse.quickReplies = ['⚡ Electrical Issue', '🚰 Plumbing Problem', '📅 Book a Technician Now', '💳 JazzCash Payment Info'];
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-[#160307] rounded-full shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Toggle Booking Concierge Chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-40 w-[94vw] sm:w-[400px] h-[520px] max-h-[82vh] bg-[#24050c] border border-[#d4af37]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-[#3b0813] border-b border-[#d4af37]/25 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#160307] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-[#fcf9f5]">
                  JD Service Concierge
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#38bdf8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud SQL Active · Mansehra</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#c4b5a5] hover:text-[#fcf9f5] hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#160307]/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-[#d4af37] text-[#160307] font-medium rounded-br-none'
                      : 'bg-[#3b0813] border border-[#d4af37]/20 text-[#fcf9f5] rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#8e7467] mt-1 px-1">{m.timestamp}</span>

                {/* Quick Reply Chips */}
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.quickReplies.map((qr, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(qr)}
                        className="px-2.5 py-1 rounded bg-[#24050c] hover:bg-[#3b0813] border border-[#d4af37]/30 text-[11px] text-[#f3e5ab] transition-colors cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 bg-[#1e0409] border-t border-white/5 flex items-center justify-between text-[11px] text-[#c4b5a5]">
            <a
              href="https://wa.me/923021822160"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25d366] flex items-center gap-1"
            >
              WhatsApp Us
            </a>
            <span aria-hidden="true">·</span>
            <a href="tel:03021822160" className="hover:text-[#d4af37] flex items-center gap-1">
              0302-1822160
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPaymentModal();
              }}
              className="hover:text-[#f3e5ab]"
            >
              JazzCash
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#24050c] border-t border-[#d4af37]/20 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask an electrical or plumbing question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-[#160307] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#fcf9f5] focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              className="p-2 bg-[#d4af37] hover:bg-[#f3e5ab] text-[#160307] rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
