'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';

interface UploadZoneProps {
  onAnalyze: (file: File) => void;
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
  const MAX_SIZE = 10 * 1024 * 1024;

  const validateAndSetFile = useCallback((file: File) => {
    setValidationError(null);

    if (!ACCEPTED_TYPES.has(file.type)) {
      setValidationError('Unsupported file type. Please upload a JPEG, PNG, GIF, or WEBP image.');
      return;
    }

    if (file.size > MAX_SIZE) {
      setValidationError('File is too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValidationError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      {!selectedFile ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleZoneClick}
          onKeyDown={(e) => e.key === 'Enter' && handleZoneClick()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200 select-none"
          style={{
            backgroundColor: isDragging ? '#1a1a1a' : '#141414',
            borderColor: isDragging ? '#dc2626' : '#262626',
          }}
          aria-label="Upload zone — click or drag and drop a BJJ image"
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#1f1f1f' }}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#dc2626"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <p className="text-base font-semibold mb-1" style={{ color: '#f5f5f5' }}>
            Drop your BJJ photo here
          </p>
          <p className="text-sm" style={{ color: '#a3a3a3' }}>
            or{' '}
            <span className="font-medium" style={{ color: '#dc2626' }}>
              click to browse
            </span>
          </p>
          <p className="text-xs mt-3" style={{ color: '#525252' }}>
            JPEG, PNG, GIF, WEBP &mdash; max 10MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      ) : (
        /* Preview card */
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: '#141414', borderColor: '#262626' }}
        >
          {/* Image preview */}
          <div className="relative w-full" style={{ maxHeight: '320px', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl!}
              alt="Selected BJJ image preview"
              className="w-full object-contain"
              style={{ maxHeight: '320px', backgroundColor: '#0a0a0a' }}
            />
          </div>

          {/* File info */}
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: '#262626' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: '#1f1f1f' }}
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#dc2626"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A2.25 2.25 0 0023.25 18V6A2.25 2.25 0 0021 3.75H3A2.25 2.25 0 00.75 6v12A2.25 2.25 0 003 20.25z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: '#f5f5f5' }}
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </p>
                <p className="text-xs" style={{ color: '#a3a3a3' }}>
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              onClick={handleRemoveFile}
              className="flex-shrink-0 ml-3 p-1.5 rounded transition-colors duration-150"
              style={{ color: '#a3a3a3' }}
              aria-label="Remove selected file"
              title="Remove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Validation error */}
      {validationError && (
        <p
          className="text-sm px-1"
          style={{ color: '#ef4444' }}
          role="alert"
        >
          {validationError}
        </p>
      )}

      {/* Analyze button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || !!validationError}
        className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: selectedFile && !validationError ? '#dc2626' : '#dc2626',
        }}
        aria-disabled={!selectedFile || !!validationError}
      >
        Analyze My Roll
      </button>

      {/* Hint */}
      <p className="text-xs text-center" style={{ color: '#525252' }}>
        Upload a still frame from your training footage for best results
      </p>
    </div>
  );
}
