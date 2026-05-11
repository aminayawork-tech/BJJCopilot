export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#dc2626', borderTopColor: 'transparent' }}
          role="status"
          aria-label="Loading"
        />
        <div
          className="absolute inset-2 rounded-full border-4 border-b-transparent animate-spin"
          style={{
            borderColor: '#7f1d1d',
            borderBottomColor: 'transparent',
            animationDirection: 'reverse',
            animationDuration: '0.8s',
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-base font-bold tracking-widest uppercase"
          style={{ color: '#f5f5f5' }}
        >
          Analyzing your roll...
        </p>
        <p className="text-sm" style={{ color: '#a3a3a3' }}>
          Your black-belt coach is reviewing the footage
        </p>
      </div>

      {/* Pulsing skeleton cards to suggest incoming bullets */}
      <div className="w-full max-w-lg flex flex-col gap-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border overflow-hidden animate-pulse"
            style={{
              backgroundColor: '#141414',
              borderColor: '#262626',
              opacity: 1 - (i - 1) * 0.2,
            }}
          >
            <div className="flex">
              <div className="w-1 flex-shrink-0" style={{ backgroundColor: '#3f3f3f' }} />
              <div className="flex-1 px-4 py-3 flex flex-col gap-2">
                <div
                  className="h-3 rounded"
                  style={{ backgroundColor: '#262626', width: `${60 - i * 8}%` }}
                />
                <div
                  className="h-3 rounded"
                  style={{ backgroundColor: '#1f1f1f', width: `${90 - i * 5}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
