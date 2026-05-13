'use client';

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';

export interface VideoFrame {
  data: string; // base64 JPEG
  timestamp: number; // seconds
}

export type AnalyzePayload =
  | { type: 'image'; file: File; userDescription: string }
  | { type: 'video'; frames: VideoFrame[]; filename: string; userDescription: string };

interface UploadZoneProps {
  onAnalyze: (payload: AnalyzePayload) => void;
}

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const ACCEPTED_VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']);
const MAX_SIZE = 100 * 1024 * 1024; // 100MB for video
const NUM_FRAMES = 6;

function isVideoFile(file: File): boolean {
  return ACCEPTED_VIDEO_TYPES.has(file.type) || /\.(mp4|mov|webm|avi)$/i.test(file.name);
}

function isImageFile(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.has(file.type);
}

async function extractFrames(videoFile: File): Promise<VideoFrame[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) { reject(new Error('Canvas not supported')); return; }

    const url = URL.createObjectURL(videoFile);
    const frames: VideoFrame[] = [];
    let seeking = false;
    let frameIndex = 0;
    let timestamps: number[] = [];

    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read video duration.'));
        return;
      }
      canvas.width = Math.min(video.videoWidth, 1280);
      canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight);

      // Distribute frames evenly, avoiding the very start/end
      const step = duration / (NUM_FRAMES + 1);
      timestamps = Array.from({ length: NUM_FRAMES }, (_, i) => parseFloat(((i + 1) * step).toFixed(2)));
      video.currentTime = timestamps[0];
    };

    video.onseeked = () => {
      if (seeking) return;
      seeking = true;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      // Strip the data:image/jpeg;base64, prefix
      frames.push({ data: dataUrl.split(',')[1], timestamp: timestamps[frameIndex] });
      frameIndex++;
      seeking = false;

      if (frameIndex < timestamps.length) {
        video.currentTime = timestamps[frameIndex];
      } else {
        URL.revokeObjectURL(url);
        resolve(frames);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video.'));
    };

    video.preload = 'auto';
    video.src = url;
    video.load();
  });
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileIsVideo, setFileIsVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string>('');
  const [customDescription, setCustomDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const CHIPS = [
    { label: 'On Top', value: 'the person on top' },
    { label: 'On Bottom', value: 'the person on bottom' },
    { label: 'Blue/Dark Gi', value: 'the person wearing the blue or dark gi' },
    { label: 'White Gi', value: 'the person wearing the white gi' },
    { label: 'Left Side', value: 'the person on the left side of the frame' },
    { label: 'Right Side', value: 'the person on the right side of the frame' },
  ];

  const userDescription = customDescription.trim()
    ? customDescription.trim()
    : selectedChip;

  const validateAndSetFile = useCallback((file: File) => {
    setValidationError(null);

    const video = isVideoFile(file);
    const image = isImageFile(file);

    if (!video && !image) {
      setValidationError('Unsupported file type. Upload a JPEG, PNG, WEBP image or MP4, MOV, WEBM video.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setValidationError('File is too large. Maximum size is 100MB.');
      return;
    }

    setSelectedFile(file);
    setFileIsVideo(video);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };
  const handleZoneClick = () => inputRef.current?.click();

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileIsVideo(false);
    setValidationError(null);
    setSelectedChip('');
    setCustomDescription('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    if (fileIsVideo) {
      setIsExtracting(true);
      try {
        const frames = await extractFrames(selectedFile);
        onAnalyze({ type: 'video', frames, filename: selectedFile.name, userDescription });
      } catch (err) {
        setValidationError(err instanceof Error ? err.message : 'Failed to process video.');
        setIsExtracting(false);
      }
    } else {
      onAnalyze({ type: 'image', file: selectedFile, userDescription });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canAnalyze = !!selectedFile && !validationError && !isExtracting;

  return (
    <div className="flex flex-col gap-4">
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
          style={{ backgroundColor: isDragging ? '#e5e5e5' : '#ffffff', borderColor: isDragging ? '#dc2626' : '#e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          aria-label="Upload zone — click or drag and drop a BJJ image or video"
        >
          <div className="flex items-center gap-4 mb-5" aria-hidden="true">
            {/* Photo icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: '#f0f0f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A2.25 2.25 0 0023.25 18V6A2.25 2.25 0 0021 3.75H3A2.25 2.25 0 00.75 6v12A2.25 2.25 0 003 20.25z" />
              </svg>
            </div>
            <span style={{ color: '#9ca3af', fontSize: '1.25rem' }}>|</span>
            {/* Video icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full" style={{ backgroundColor: '#f0f0f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
            </div>
          </div>

          <p className="text-base font-semibold mb-1" style={{ color: '#111111' }}>
            Drop your BJJ photo or video here
          </p>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            or{' '}
            <span className="font-medium" style={{ color: '#dc2626' }}>click to browse</span>
          </p>
          <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>
            Images: JPEG, PNG, WEBP &nbsp;·&nbsp; Video: MP4, MOV, WEBM &nbsp;·&nbsp; max 100MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,video/x-msvideo,.mov,.mp4,.webm,.avi"
            className="sr-only"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          {/* Preview */}
          <div className="relative w-full" style={{ maxHeight: '320px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
            {fileIsVideo ? (
              <video
                src={previewUrl!}
                controls
                className="w-full"
                style={{ maxHeight: '320px', display: 'block' }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl!}
                alt="Selected BJJ image preview"
                className="w-full object-contain"
                style={{ maxHeight: '320px' }}
              />
            )}
            {fileIsVideo && (
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: '#dc2626', color: '#fff' }}
              >
                Video · {NUM_FRAMES} frames
              </div>
            )}
          </div>

          {/* File info row */}
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#e5e5e5' }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#f0f0f0' }} aria-hidden="true">
                {fileIsVideo ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A2.25 2.25 0 0023.25 18V6A2.25 2.25 0 0021 3.75H3A2.25 2.25 0 00.75 6v12A2.25 2.25 0 003 20.25z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#111111' }} title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs" style={{ color: '#6b7280' }}>{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="flex-shrink-0 ml-3 p-1.5 rounded transition-colors duration-150"
              style={{ color: '#6b7280' }}
              aria-label="Remove selected file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Who are you selector — shown once a file is picked */}
      {selectedFile && (
        <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>
            Which person are you?
          </p>
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => {
              const active = selectedChip === chip.value && !customDescription.trim();
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => { setSelectedChip(active ? '' : chip.value); setCustomDescription(''); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
                  style={{
                    backgroundColor: active ? '#dc2626' : '#f0f0f0',
                    borderColor: active ? '#dc2626' : '#d1d5db',
                    color: active ? '#fff' : '#6b7280',
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder='Or describe yourself… e.g. "the taller guy" or "wearing rash guard"'
            value={customDescription}
            onChange={(e) => { setCustomDescription(e.target.value); if (e.target.value) setSelectedChip(''); }}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors duration-150"
            style={{
              backgroundColor: '#ffffff',
              borderColor: customDescription ? '#dc2626' : '#d1d5db',
              color: '#111111',
              fontSize: 16,
            }}
          />
          {!userDescription && (
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Skipping this — AI will make its best guess
            </p>
          )}
        </div>
      )}

      {validationError && (
        <p className="text-sm px-1" style={{ color: '#ef4444' }} role="alert">{validationError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canAnalyze}
        className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#dc2626' }}
      >
        {isExtracting ? 'Extracting Frames…' : 'Analyze My Roll'}
      </button>

      {selectedFile && fileIsVideo && !isExtracting && (
        <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
          {NUM_FRAMES} frames will be extracted evenly across your clip
        </p>
      )}
      {(!selectedFile || !fileIsVideo) && !isExtracting && (
        <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
          Upload a photo or video clip from your training footage
        </p>
      )}
    </div>
  );
}
