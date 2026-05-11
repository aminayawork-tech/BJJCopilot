'use client';

import { useState, useRef, useEffect } from 'react';
import { bjjTerms } from '@/lib/bjjTerms';

// Category badge colors
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Positions': { bg: '#1e3a5f', text: '#93c5fd' },
  'Guards': { bg: '#1a3a1a', text: '#86efac' },
  'Submissions': { bg: '#3d1a1a', text: '#fca5a5' },
  'Sweeps': { bg: '#3d2e1a', text: '#fdba74' },
  'Escapes & Movements': { bg: '#2a1a3d', text: '#c4b5fd' },
  'Concepts': { bg: '#1a3a3a', text: '#67e8f9' },
};

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? { bg: '#262626', text: '#a3a3a3' };
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {category}
    </span>
  );
}

// ---- Glossary Section ----
function GlossarySection() {
  const [query, setQuery] = useState('');
  const filtered = bjjTerms.filter((t) => {
    const q = query.toLowerCase();
    return (
      t.term.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 tracking-wide uppercase" style={{ color: '#f5f5f5' }}>
        BJJ Glossary
      </h2>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#525252" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search terms, categories, or definitions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none border transition-colors duration-150"
          style={{
            backgroundColor: '#141414',
            borderColor: query ? '#dc2626' : '#262626',
            color: '#f5f5f5',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: '#a3a3a3' }}>
          No terms match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((term) => (
            <div
              key={term.term}
              className="rounded-lg border p-3 flex flex-col gap-1.5"
              style={{ backgroundColor: '#141414', borderColor: '#262626' }}
            >
              <p className="text-sm font-bold leading-snug" style={{ color: '#dc2626' }}>
                {term.term}
              </p>
              <CategoryBadge category={term.category} />
              <p className="text-xs leading-relaxed mt-1" style={{ color: '#a3a3a3' }}>
                {term.definition}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Chat Section ----
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error ?? 'Something went wrong. Please try again.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please check your connection.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mt-10">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#a3a3a3' }}>
          Ask the Coach
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
      </div>

      {/* Chat container */}
      <div
        className="rounded-lg border overflow-hidden flex flex-col"
        style={{ backgroundColor: '#0f0f0f', borderColor: '#262626', minHeight: 360 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: 420 }}>
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <span className="text-3xl mb-3" aria-hidden="true">🥋</span>
              <p className="text-sm font-semibold mb-1" style={{ color: '#f5f5f5' }}>
                Ask your coach anything
              </p>
              <p className="text-xs" style={{ color: '#525252' }}>
                Techniques, escapes, positions, game plans…
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                style={
                  msg.role === 'user'
                    ? { backgroundColor: '#dc2626', color: '#fff', borderBottomRightRadius: 4 }
                    : { backgroundColor: '#1f1f1f', color: '#f5f5f5', borderBottomLeftRadius: 4 }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3 flex gap-1 items-center"
                style={{ backgroundColor: '#1f1f1f', borderBottomLeftRadius: 4 }}
                aria-label="Coach is typing"
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#525252',
                      animation: `bounce 1s infinite ${dot * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="border-t p-3 flex gap-2 items-end sticky bottom-0"
          style={{ borderColor: '#262626', backgroundColor: '#141414' }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // auto-grow
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a technique, position, escape…"
            className="flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none border transition-colors duration-150 overflow-hidden"
            style={{
              backgroundColor: '#0a0a0a',
              borderColor: input ? '#dc2626' : '#3f3f3f',
              color: '#f5f5f5',
              minHeight: 40,
              maxHeight: 120,
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-opacity duration-150 disabled:opacity-40"
            style={{ backgroundColor: '#dc2626' }}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bounce keyframe */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function LearningCenter() {
  return (
    <div className="flex flex-col gap-0">
      <GlossarySection />
      <ChatSection />
    </div>
  );
}
