'use client';

import { useState } from 'react';

export interface SavedReview {
  id: string;
  timestamp: number;
  thumbnailDataUrl: string;
  filename: string;
  userDescription: string;
  analysis: string;
}

interface SavedReviewsProps {
  reviews: SavedReview[];
  onDelete: (id: string) => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ' ·');
}

function AnalysisText({ text }: { text: string }) {
  return (
    <pre
      className="text-sm whitespace-pre-wrap leading-relaxed mt-3"
      style={{ color: '#374151', fontFamily: 'inherit' }}
    >
      {text}
    </pre>
  );
}

function ReviewCard({ review, onDelete }: { review: SavedReview; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      {/* Card header row */}
      <div className="flex gap-3 p-4">
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 rounded-lg overflow-hidden"
          style={{ width: 80, height: 80, backgroundColor: '#f0f0f0' }}
        >
          {review.thumbnailDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.thumbnailDataUrl}
              alt="Review thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A2.25 2.25 0 0023.25 18V6A2.25 2.25 0 0021 3.75H3A2.25 2.25 0 00.75 6v12A2.25 2.25 0 003 20.25z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>
            {formatDate(review.timestamp)}
          </p>
          <p className="text-sm font-semibold truncate" style={{ color: '#111111' }}>
            {review.filename}
          </p>
          {review.userDescription && (
            <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>
              {review.userDescription}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col gap-2 ml-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-3 py-1.5 rounded text-xs font-semibold border transition-colors duration-150"
            style={{
              backgroundColor: expanded ? '#dc2626' : 'transparent',
              borderColor: expanded ? '#dc2626' : '#d1d5db',
              color: expanded ? '#fff' : '#6b7280',
            }}
            aria-expanded={expanded}
          >
            {expanded ? 'Close' : 'View'}
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="flex items-center justify-center p-1.5 rounded border transition-colors duration-150 hover:border-red-600 hover:text-red-600"
            style={{ borderColor: '#d1d5db', color: '#6b7280' }}
            aria-label="Delete review"
          >
            {/* Trash icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded analysis */}
      {expanded && (
        <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: '#e5e5e5' }}>
          <AnalysisText text={review.analysis} />
        </div>
      )}
    </div>
  );
}

export default function SavedReviews({ reviews, onDelete }: SavedReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f0f0f0' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-base font-semibold mb-1" style={{ color: '#111111' }}>
          No saved reviews yet.
        </p>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Analyze a roll to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold tracking-widest uppercase px-1" style={{ color: '#6b7280' }}>
        {reviews.length} saved {reviews.length === 1 ? 'review' : 'reviews'}
      </p>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} onDelete={onDelete} />
      ))}
    </div>
  );
}
