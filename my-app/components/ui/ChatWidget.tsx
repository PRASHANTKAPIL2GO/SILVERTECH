'use client';

import React, { useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const QUICK_REPLIES = [
  'Tell me about modules',
  'How do I get started?',
  'What is password security?',
  'Show my progress',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: uid(), 
      role: 'assistant', 
      content: 'Hello! 👋 I\'m your SilverTech learning assistant. I can help you with modules, lessons, progress tracking, and more. What would you like to know?',
      timestamp: new Date()
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg: Message = { id: uid(), role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    // add placeholder assistant message
    const placeholder: Message = { id: uid(), role: 'assistant', content: '⏳ Thinking...', timestamp: new Date() };
    setMessages((m) => [...m, placeholder]);
    setLoading(true);

    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.concat(userMsg).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await resp.json();
      const reply = data?.reply ?? 'Sorry, I couldn\'t process that. Please try again.';

      setMessages((m) => {
        // replace the last placeholder assistant message with actual reply
        const idx = m.map((x) => x.role).lastIndexOf('assistant');
        if (idx >= 0) {
          const copy = [...m];
          copy[idx] = { ...copy[idx], content: reply, timestamp: new Date() };
          return copy;
        }
        return [...m, { id: uid(), role: 'assistant', content: reply, timestamp: new Date() }];
      });
    } catch (err) {
      setMessages((m) => [...m, { id: uid(), role: 'assistant', content: '❌ Error: Could not reach the assistant. Please try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {open && (
          <div className="mb-2 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600">Quick questions:</p>
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="text-left text-sm px-2 py-1 hover:bg-blue-50 rounded text-gray-700 hover:text-blue-600 transition"
              >
                • {reply}
              </button>
            ))}
          </div>
        )}
        <button
          aria-label={open ? 'Close chat' : 'Open chat'}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V5z" />
          </svg>
          <span className="hidden sm:inline font-semibold">Chat</span>
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
              <div>
                <div className="font-semibold text-sm">SilverTech Assistant</div>
                <div className="text-xs opacity-75">Always here to help</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No messages yet</p>
              </div>
            ) : (
              messages.filter(m => m.role !== 'system').map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
                  <div className={`${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none shadow-sm'
                  } max-w-[75%] px-4 py-2.5 text-sm leading-relaxed`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 rounded-2xl rounded-tl-none px-4 py-2.5">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 border-t bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a question..."
                className="flex-1 resize-none h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
