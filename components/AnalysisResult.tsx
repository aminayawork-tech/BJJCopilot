'use client';

import { useState, useRef, useEffect } from 'react';

interface AnalysisResultProps {
  analysis: string;
  onReset: () => void;
  onSave?: () => void;
  savedConfirmed?: boolean;
}

interface ParsedBullet {
  header: string;
  body: string;
  isQuickWin: boolean;
}

function parseBullets(text: string): ParsedBullet[] {
  const bullets: ParsedBullet[] = [];
  // Split on lines that start with a bullet character
  const lines = text.split('\n');

  let currentHeader = '';
  let currentBody = '';
  let currentIsQuickWin = false;

  const flush = () => {
    if (currentHeader) {
      bullets.push({
        header: currentHeader.trim(),
        body: currentBody.trim(),
        isQuickWin: currentIsQuickWin,
      });
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect bullet start: lines beginning with • or - or * at start of line
    if (trimmed.startsWith('•') || trimmed.startsWith('**•') || trimmed.startsWith('**-')) {
      flush();
      currentHeader = trimmed.replace(/^[•\-\*]+\s*/, '').replace(/\*\*/g, '');
      currentBody = '';
      currentIsQuickWin =
        currentHeader.toLowerCase().includes('quick win') ||
        currentHeader.toLowerCase().includes('quick wins');
    } else if (trimmed === '') {
      // blank line — keep accumulating
      if (currentBody) currentBody += '\n';
    } else if (currentHeader) {
      // continuation / body of current bullet
      const bodyLine = trimmed.replace(/^\*+\s*/, '');
      if (currentBody) {
        currentBody += ' ' + bodyLine;
      } else {
        currentBody = bodyLine;
      }
    }
  }

  flush();
  return bullets;
}

export default function AnalysisResult({ analysis, onReset, onSave, savedConfirmed }: AnalysisResultProps) {
  const [localSaved, setLocalSaved] = useState(false);
  const isSaved = savedConfirmed || localSaved;

  const handleSave = () => {
    onSave?.();
    setLocalSaved(true);
  };

  const bullets = parseBullets(analysis);

  // Separate quick wins from regular bullets
  const regularBullets = bullets.filter((b) => !b.isQuickWin);
  const quickWins = bullets.filter((b) => b.isQuickWin);

  // If parsing yields nothing meaningful, render raw text
  const hasStructuredContent = bullets.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: '#a3a3a3' }}
        >
          Coach&apos;s Breakdown
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
      </div>

      {hasStructuredContent ? (
        <>
          {/* Regular bullets */}
          {regularBullets.length > 0 && (
            <div className="flex flex-col gap-3">
              {regularBullets.map((bullet, index) => (
                <BulletCard key={index} bullet={bullet} />
              ))}
            </div>
          )}

          {/* Quick Wins */}
          {quickWins.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#ca8a04" aria-hidden="true">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                </svg>
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: '#ca8a04' }}
                >
                  Quick Wins
                </span>
              </div>
              {quickWins.map((bullet, index) => (
                <BulletCard key={index} bullet={bullet} isQuickWin />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Fallback: raw text */
        <div
          className="rounded-lg border p-5"
          style={{ backgroundColor: '#141414', borderColor: '#262626' }}
        >
          <pre
            className="text-sm whitespace-pre-wrap leading-relaxed"
            style={{ color: '#f5f5f5', fontFamily: 'inherit' }}
          >
            {analysis}
          </pre>
        </div>
      )}

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: '#262626' }} />

      {/* Save Review button */}
      {onSave && (
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-150 border"
          style={
            isSaved
              ? { backgroundColor: 'transparent', borderColor: '#3f3f3f', color: '#525252', cursor: 'default' }
              : { backgroundColor: 'transparent', borderColor: '#dc2626', color: '#dc2626' }
          }
        >
          {isSaved ? 'Review Saved' : 'Save Review'}
        </button>
      )}

      {/* Analyze another button */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-widest uppercase transition-opacity duration-150 hover:opacity-90"
        style={{ backgroundColor: '#dc2626' }}
      >
        Analyze Another
      </button>

      {/* Discuss this roll */}
      <ReviewChat analysis={analysis} />
    </div>
  );
}

// ── Review Chat ────────────────────────────────────────────────────────────

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

function ReviewChat({ analysis }: { analysis: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // Lock scroll root when maximized
  useEffect(() => {
    const root = document.getElementById('app-scroll-root');
    if (root) root.style.overflow = isMaximized ? 'hidden' : '';
    return () => { if (root) root.style.overflow = ''; };
  }, [isMaximized]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, analysisContext: analysis }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? data.error ?? 'Something went wrong.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const messagesBubbles = (
    <>
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
          <p className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>Ask about your roll</p>
          <p className="text-xs" style={{ color: '#525252' }}>
            "Why did I lose that position?" · "How do I drill the seatbelt?" · "What's the escape from that spot?"
          </p>
        </div>
      )}
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className="max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap"
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
          <div className="rounded-2xl px-4 py-3 flex gap-1 items-center" style={{ backgroundColor: '#1f1f1f', borderBottomLeftRadius: 4 }}>
            {[0, 1, 2].map((d) => (
              <span key={d} className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#525252', animation: `reviewBounce 1s infinite ${d * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}
    </>
  );

  const inputBar = (
    <div className="border-t p-3 flex gap-2 items-end" style={{ borderColor: '#262626', backgroundColor: '#141414' }}>
      <textarea
        ref={inputRef}
        rows={1}
            value={input}
            onChange={(e) => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
            onKeyDown={onKeyDown}
            placeholder="Ask about this roll…"
            className="flex-1 resize-none rounded-lg px-3 py-2 outline-none border transition-colors duration-150 overflow-hidden"
            style={{ backgroundColor: '#0a0a0a', borderColor: input ? '#dc2626' : '#3f3f3f', color: '#f5f5f5', fontSize: 16, minHeight: 40, maxHeight: 100 }}
            disabled={isLoading}
          />
          <button onClick={send} disabled={!input.trim() || isLoading}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-opacity duration-150 disabled:opacity-40"
            style={{ backgroundColor: '#dc2626' }} aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
  );

  return (
    <>
      {/* Maximized overlay */}
      {isMaximized && (
        <div className="fixed inset-0 flex flex-col z-50" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: '#262626', backgroundColor: '#141414' }}>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#f5f5f5' }}>Discuss This Roll</span>
            <button onClick={() => setIsMaximized(false)} className="p-2 rounded-lg" style={{ color: '#a3a3a3' }} aria-label="Minimize">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25" />
              </svg>
            </button>
          </div>
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ overscrollBehavior: 'contain' }}>
            {messagesBubbles}
          </div>
          {inputBar}
        </div>
      )}

      {/* Inline section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#a3a3a3' }}>Discuss This Roll</span>
          <div className="h-px flex-1" style={{ backgroundColor: '#262626' }} />
        </div>

        <div className="rounded-lg border flex flex-col overflow-hidden" style={{ backgroundColor: '#0f0f0f', borderColor: '#262626', height: 360 }}>
          {/* Header with maximize */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0" style={{ borderColor: '#262626', backgroundColor: '#141414' }}>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#a3a3a3' }}>
              {messages.filter(m => m.role === 'user').length > 0 ? `${messages.filter(m => m.role === 'user').length} question${messages.filter(m => m.role === 'user').length !== 1 ? 's' : ''}` : 'Chat'}
            </span>
            <button onClick={() => setIsMaximized(true)} className="p-1.5 rounded" style={{ color: '#a3a3a3' }} aria-label="Maximize chat">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ overscrollBehavior: 'contain' }}>
            {messagesBubbles}
          </div>
          {inputBar}
        </div>
      </div>

      <style>{`
        @keyframes reviewBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ── Bullet Card ─────────────────────────────────────────────────────────────

function BulletCard({
  bullet,
  isQuickWin = false,
}: {
  bullet: ParsedBullet;
  isQuickWin?: boolean;
}) {
  const accentColor = isQuickWin ? '#ca8a04' : '#dc2626';

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: '#141414', borderColor: '#262626' }}
    >
      <div className="flex">
        {/* Left accent bar */}
        <div
          className="w-1 flex-shrink-0"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="flex-1 px-4 py-3">
          {/* Header / position */}
          <p
            className="text-sm font-bold leading-snug mb-1"
            style={{ color: accentColor }}
          >
            {bullet.header}
          </p>

          {/* Body */}
          {bullet.body && (
            <p className="text-sm leading-relaxed" style={{ color: '#d4d4d4' }}>
              {bullet.body}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
