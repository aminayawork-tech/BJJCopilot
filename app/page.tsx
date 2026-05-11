'use client';

import { useState } from 'react';
import UploadZone, { AnalyzePayload } from '@/components/UploadZone';
import AnalysisResult from '@/components/AnalysisResult';
import LoadingState from '@/components/LoadingState';

type AppState = 'idle' | 'loading' | 'result' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysis, setAnalysis] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setAppState('loading');
    setAnalysis('');
    setErrorMessage('');

    let response: Response;
    try {
      if (payload.type === 'image') {
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('userDescription', payload.userDescription);
        response = await fetch('/api/analyze', { method: 'POST', body: formData });
      } else {
        response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frames: payload.frames, filename: payload.filename, userDescription: payload.userDescription }),
        });
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setAppState('error');
      return;
    }

    try {

      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        setAppState('error');
        return;
      }
      setAnalysis(data.analysis);
      setAppState('result');
    } catch {
      setErrorMessage('Failed to parse server response. Please try again.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysis('');
    setErrorMessage('');
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#262626' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl" aria-hidden="true">🥋</span>
              <h1
                className="text-3xl font-black tracking-widest uppercase"
                style={{ color: '#dc2626' }}
              >
                BJJ Copilot
              </h1>
              <span className="text-3xl" aria-hidden="true">🥋</span>
            </div>
            <p className="text-sm font-medium tracking-widest uppercase" style={{ color: '#a3a3a3' }}>
              AI-Powered Grappling Coach
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {appState === 'idle' && (
          <UploadZone onAnalyze={handleAnalyze} />
        )}

        {appState === 'loading' && (
          <LoadingState />
        )}

        {appState === 'result' && (
          <AnalysisResult analysis={analysis} onReset={handleReset} />
        )}

        {appState === 'error' && (
          <div
            className="rounded-lg border p-6 text-center"
            style={{ backgroundColor: '#141414', borderColor: '#dc2626' }}
          >
            <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#f5f5f5' }}>
              Analysis Failed
            </h2>
            <p className="mb-6" style={{ color: '#a3a3a3' }}>
              {errorMessage}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded font-semibold text-white transition-colors duration-150 hover:opacity-90"
              style={{ backgroundColor: '#dc2626' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center" style={{ color: '#a3a3a3' }}>
        <p className="text-xs tracking-wide uppercase">
          Powered by Claude AI &mdash; For training purposes only
        </p>
      </footer>
    </main>
  );
}
