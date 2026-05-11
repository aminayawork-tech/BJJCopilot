'use client';

import { useState, useRef, useEffect } from 'react';
import { bjjTerms, BJJTerm } from '@/lib/bjjTerms';

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

// ---- Term Card ----
function TermCard({ term, isOpen, onToggle }: { term: BJJTerm; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-lg border flex flex-col overflow-hidden cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: '#141414', borderColor: isOpen ? '#dc2626' : '#262626' }}
      onClick={onToggle}
    >
      {/* Card header — always visible */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold leading-snug" style={{ color: '#dc2626' }}>
            {term.term}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200"
            style={{ color: '#525252', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <CategoryBadge category={term.category} />
      </div>

      {/* Expanded content */}
      {isOpen && (
        <div
          className="px-3 pb-3 flex flex-col gap-3 border-t"
          style={{ borderColor: '#262626' }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs leading-relaxed pt-3" style={{ color: '#a3a3a3' }}>
            {term.definition}
          </p>

          {term.videos.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#525252' }}>
                Watch on YouTube
              </p>
              {term.videos.map((v) => (
                <a
                  key={v.label}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition-opacity duration-150 hover:opacity-80"
                  style={{ backgroundColor: '#1f1f1f', border: '1px solid #3f3f3f' }}
                >
                  {/* Play icon */}
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#dc2626' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#f5f5f5' }}>{v.label}</span>
                  {/* External link icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#525252" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Glossary Section ----
function GlossarySection() {
  const [query, setQuery] = useState('');
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  const filtered = bjjTerms.filter((t) => {
    const q = query.toLowerCase();
    return (
      t.term.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
    );
  });

  const handleToggle = (term: string) => {
    setOpenTerm((prev) => (prev === term ? null : term));
  };

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
          onChange={(e) => { setQuery(e.target.value); setOpenTerm(null); }}
          className="w-full rounded-lg pl-9 pr-4 py-2.5 outline-none border transition-colors duration-150"
          style={{
            backgroundColor: '#141414',
            borderColor: query ? '#dc2626' : '#262626',
            color: '#f5f5f5',
            fontSize: 16,
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
            <TermCard
              key={term.term}
              term={term}
              isOpen={openTerm === term.term}
              onToggle={() => handleToggle(term.term)}
            />
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
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Lock body scroll when maximized
  useEffect(() => {
    const scrollRoot = document.getElementById('app-scroll-root');
    if (isMaximized && scrollRoot) {
      scrollRoot.style.overflow = 'hidden';
    } else if (scrollRoot) {
      scrollRoot.style.overflow = '';
    }
    return () => { if (scrollRoot) scrollRoot.style.overflow = ''; };
  }, [isMaximized]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply ?? data.error ?? 'Something went wrong.' },
      ]);
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

  const chatContent = (
    <>
      {/* Messages area */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        style={{ overscrollBehavior: 'contain' }}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="#525252" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <p className="text-sm font-semibold mb-1" style={{ color: '#f5f5f5' }}>Ask your coach anything</p>
            <p className="text-xs" style={{ color: '#525252' }}>Techniques, escapes, positions, game plans…</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap"
              style={{
                fontSize: 15,
                ...(msg.role === 'user'
                  ? { backgroundColor: '#dc2626', color: '#fff', borderBottomRightRadius: 4 }
                  : { backgroundColor: '#1f1f1f', color: '#f5f5f5', borderBottomLeftRadius: 4 }),
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

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
                  style={{ backgroundColor: '#525252', animation: `chatBounce 1s infinite ${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        className="border-t p-3 flex gap-2 items-end"
        style={{ borderColor: '#262626', backgroundColor: '#141414' }}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a technique, position, escape…"
          className="flex-1 resize-none rounded-lg px-3 py-2 outline-none border transition-colors duration-150 overflow-hidden"
          style={{
            backgroundColor: '#0a0a0a',
            borderColor: input ? '#dc2626' : '#3f3f3f',
            color: '#f5f5f5',
            fontSize: 16,
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
    </>
  );

  return (
    <>
      {/* Maximized overlay */}
      {isMaximized && (
        <div
          className="fixed inset-0 flex flex-col z-50"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          {/* Overlay header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: '#262626', backgroundColor: '#141414' }}
          >
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#f5f5f5' }}>
              Ask the Coach
            </span>
            <button
              onClick={() => setIsMaximized(false)}
              className="p-2 rounded-lg transition-colors duration-150"
              style={{ color: '#a3a3a3' }}
              aria-label="Minimize chat"
            >
              {/* Compress/minimize icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25" />
              </svg>
            </button>
          </div>
          {chatContent}
        </div>
      )}

      {/* Inline section (always rendered to preserve state) */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#a3a3a3' }}>
            Ask the Coach
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
        </div>

        <div
          className="rounded-lg border overflow-hidden flex flex-col"
          style={{ backgroundColor: '#0f0f0f', borderColor: '#262626', height: 420 }}
        >
          {/* Chat header with maximize button */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
            style={{ borderColor: '#262626', backgroundColor: '#141414' }}
          >
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#a3a3a3' }}>
              {messages.length > 0 ? `${messages.filter(m => m.role === 'user').length} question${messages.filter(m => m.role === 'user').length !== 1 ? 's' : ''}` : 'Chat'}
            </span>
            <button
              onClick={() => setIsMaximized(true)}
              className="p-1.5 rounded transition-colors duration-150"
              style={{ color: '#a3a3a3' }}
              aria-label="Maximize chat"
            >
              {/* Expand icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
          {chatContent}
        </div>
      </div>

      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
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
