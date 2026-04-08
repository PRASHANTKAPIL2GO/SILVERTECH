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
  const [isMounted, setIsMounted] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isMounted && messages.length > 1) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg: Message = { id: uid(), role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.concat(userMsg).map(({ role, content }) => ({ role, content })) }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || `API Error: ${resp.status}`);
      }

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
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : 'Could not reach the assistant';
      setMessages((m) => [...m, { id: uid(), role: 'assistant', content: `❌ Error: ${errorMsg}. Please try again.`, timestamp: new Date() }]);
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

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear chat history?')) {
      setMessages([
        { 
          id: uid(), 
          role: 'assistant', 
          content: 'Hello! 👋 I\'m your SilverTech learning assistant. I can help you with modules, lessons, progress tracking, and more. What would you like to know?',
          timestamp: new Date()
        },
      ]);
      localStorage.removeItem('chatHistory');
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
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                className="hover:bg-white/20 p-2 rounded transition text-xs font-medium"
                title="Clear chat history"
              >
                🗑️
              </button>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12 flex flex-col items-center justify-center h-full">
                <p className="text-4xl mb-3">👋</p>
                <p className="text-lg font-semibold mb-1">No messages yet</p>
                <p className="text-xs">Start a conversation to get help</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.filter(m => m.role !== 'system').map((m, idx, arr) => {
                  const isFirstInGroup = idx === 0 || arr[idx - 1]?.role !== m.role;
                  const isLastInGroup = idx === arr.length - 1 || arr[idx + 1]?.role !== m.role;
                  const showAvatar = isFirstInGroup;
                  
                  return (
                    <div 
                      key={m.id} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 animate-slideIn ${!isLastInGroup ? 'mb-0.5' : 'mb-3'}`}
                    >
                      {m.role === 'assistant' && showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">A</div>
                      )}
                      {m.role === 'assistant' && !showAvatar && (
                        <div className="w-8 flex-shrink-0"></div>
                      )}
                      
                      <div className={`flex flex-col max-w-[65%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`${
                          m.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        } ${
                          isFirstInGroup && isLastInGroup ? 'rounded-2xl' :
                          isFirstInGroup ? 'rounded-t-2xl rounded-b-lg' :
                          isLastInGroup ? 'rounded-b-2xl rounded-t-lg' :
                          'rounded-lg'
                        } px-4 py-2 text-sm leading-relaxed break-words`}>
                          {m.content}
                        </div>
                        {isLastInGroup && m.timestamp && (
                          <div className={`text-xs mt-1 ${m.role === 'user' ? 'text-right pr-1' : 'text-left pl-1'} text-gray-400 font-medium`}>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>

                      {m.role === 'user' && showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">Y</div>
                      )}
                      {m.role === 'user' && !showAvatar && (
                        <div className="w-8 flex-shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {loading && (
              <div className="flex justify-start gap-2 animate-slideIn">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">A</div>
                <div className="flex flex-col max-w-[65%]">
                  <div className="bg-gray-200 text-gray-600 rounded-t-2xl rounded-b-lg px-4 py-2">
                    <span className="inline-flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </span>
                  </div>
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
