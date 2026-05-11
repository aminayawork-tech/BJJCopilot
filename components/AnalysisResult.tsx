'use client';

interface AnalysisResultProps {
  analysis: string;
  onReset: () => void;
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

export default function AnalysisResult({ analysis, onReset }: AnalysisResultProps) {
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
                <span className="text-base" aria-hidden="true">⚡</span>
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

      {/* Analyze another button */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-widest uppercase transition-opacity duration-150 hover:opacity-90"
        style={{ backgroundColor: '#dc2626' }}
      >
        Analyze Another
      </button>
    </div>
  );
}

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
