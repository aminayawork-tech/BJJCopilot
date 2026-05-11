'use client';

import { useState, useEffect } from 'react';
import UploadZone, { AnalyzePayload } from '@/components/UploadZone';
import AnalysisResult from '@/components/AnalysisResult';
import LoadingState from '@/components/LoadingState';
import SavedReviews, { SavedReview } from '@/components/SavedReviews';
import LearningCenter from '@/components/LearningCenter';

type AppState = 'idle' | 'loading' | 'result' | 'error';
type ActiveTab = 'analyze' | 'saved' | 'learn';

interface PendingReview {
  analysis: string;
  filename: string;
  userDescription: string;
  payload: AnalyzePayload;
}

const STORAGE_KEY = 'bjj_saved_reviews';

function loadReviews(): SavedReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedReview[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews: SavedReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // quota exceeded or private mode
  }
}

/** Resize a File (image) to max 300px on longest side, return data URL */
function createThumbnailFromImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX = 300;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => resolve('');
      img.src = dataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/** For video payloads, use the first extracted frame as thumbnail */
function createThumbnailFromFrames(frames: { data: string }[]): string {
  if (frames.length === 0) return '';
  return `data:image/jpeg;base64,${frames[0].data}`;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysis, setAnalysis] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyze');
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [savedReviews, setSavedReviews] = useState<SavedReview[]>([]);
  const [reviewSaved, setReviewSaved] = useState(false);

  // Load saved reviews from localStorage on mount
  useEffect(() => {
    setSavedReviews(loadReviews());
  }, []);

  const handleAnalyze = async (payload: AnalyzePayload) => {
    setAppState('loading');
    setAnalysis('');
    setErrorMessage('');
    setReviewSaved(false);

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
      setPendingReview({
        analysis: data.analysis,
        filename: payload.type === 'image' ? payload.file.name : payload.filename,
        userDescription: payload.userDescription,
        payload,
      });
      setAppState('result');
      // Scroll to top so user sees the breakdown first, not the chat
      const root = document.getElementById('app-scroll-root');
      if (root) root.scrollTop = 0;
    } catch {
      setErrorMessage('Failed to parse server response. Please try again.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysis('');
    setErrorMessage('');
    setPendingReview(null);
    setReviewSaved(false);
  };

  const handleSaveReview = async () => {
    if (!pendingReview) return;

    let thumbnailDataUrl = '';
    if (pendingReview.payload.type === 'image') {
      thumbnailDataUrl = await createThumbnailFromImage(pendingReview.payload.file);
    } else {
      thumbnailDataUrl = createThumbnailFromFrames(pendingReview.payload.frames);
    }

    const review: SavedReview = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      thumbnailDataUrl,
      filename: pendingReview.filename,
      userDescription: pendingReview.userDescription,
      analysis: pendingReview.analysis,
    };

    const updated = [review, ...savedReviews];
    setSavedReviews(updated);
    saveReviews(updated);
    setReviewSaved(true);
  };

  const handleDeleteReview = (id: string) => {
    const updated = savedReviews.filter((r) => r.id !== id);
    setSavedReviews(updated);
    saveReviews(updated);
  };

  const TABS: { id: ActiveTab; label: string }[] = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'saved', label: 'Saved Reviews' },
    { id: 'learn', label: 'Learning Center' },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#262626' }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-2">
              <h1
                className="text-3xl font-black tracking-widest uppercase"
                style={{ color: '#dc2626' }}
              >
                BJJ Copilot
              </h1>
            </div>
            <p className="text-sm font-medium tracking-widest uppercase" style={{ color: '#a3a3a3' }}>
              AI-Powered Grappling Coach
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-4xl mx-auto px-4 pb-0">
          <nav className="flex gap-1" role="tablist" aria-label="Main navigation">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Direct scrollTop assignment — more reliable than scrollTo() on iOS Safari
                    const root = document.getElementById('app-scroll-root');
                    if (root) root.scrollTop = 0;
                  }}
                  className="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors duration-150 relative"
                  style={{
                    color: isActive ? '#dc2626' : '#a3a3a3',
                    borderBottom: isActive ? '2px solid #dc2626' : '2px solid transparent',
                    backgroundColor: 'transparent',
                  }}
                >
                  {tab.label}
                  {tab.id === 'saved' && savedReviews.length > 0 && (
                    <span
                      className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#dc2626', color: '#fff', fontSize: '0.6rem' }}
                    >
                      {savedReviews.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <>
            {appState === 'idle' && (
              <UploadZone onAnalyze={handleAnalyze} />
            )}

            {appState === 'loading' && (
              <LoadingState />
            )}

            {appState === 'result' && (
              <AnalysisResult
                analysis={analysis}
                onReset={handleReset}
                onSave={handleSaveReview}
                savedConfirmed={reviewSaved}
              />
            )}

            {appState === 'error' && (
              <div
                className="rounded-lg border p-6 text-center"
                style={{ backgroundColor: '#141414', borderColor: '#dc2626' }}
              >
                <div className="flex justify-center mb-4" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
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
          </>
        )}

        {/* Saved Reviews Tab */}
        {activeTab === 'saved' && (
          <SavedReviews reviews={savedReviews} onDelete={handleDeleteReview} />
        )}

        {/* Learning Center Tab */}
        {activeTab === 'learn' && (
          <LearningCenter />
        )}
      </div>

    </main>
  );
}
