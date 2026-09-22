import React, { useState } from 'react';
import { ProcessedOutput, ImageMeta } from '../types';
import { Download, RefreshCw, ArrowLeft, Check, Sparkles, Home } from 'lucide-react';
import { formatBytes, sanitizeFileName, triggerDownload } from '../utils/imageEngine';

interface OutputPreviewProps {
  originalMeta: ImageMeta;
  processed: ProcessedOutput;
  onEditAgain: () => void;
  onStartOver: () => void;
  onGoHome?: () => void;
}

export const OutputPreview: React.FC<OutputPreviewProps> = ({
  originalMeta,
  processed,
  onEditAgain,
  onStartOver,
  onGoHome,
}) => {
  const [downloadFilename, setDownloadFilename] = useState(
    sanitizeFileName(processed.filename)
  );
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const fullDownloadName = `${downloadFilename || 'processed-image'}.${processed.format}`;

  const handleDownload = () => {
    triggerDownload(processed.blob, fullDownloadName);
    setHasDownloaded(true);
    setTimeout(() => setHasDownloaded(false), 3000);
  };

  const sizeDelta = originalMeta.size - processed.size;
  const isReduced = sizeDelta > 0;
  const percentChange =
    originalMeta.size > 0 ? Math.round((Math.abs(sizeDelta) / originalMeta.size) * 100) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8">
      {/* Top Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center justify-between mb-4 bg-white px-3 sm:px-4 py-2.5 rounded-xl border border-neutral-200 shadow-2xs select-none"
      >
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
          {onGoHome && (
            <>
              <button
                type="button"
                id="output-nav-home"
                onClick={onGoHome}
                className="flex items-center gap-1 text-neutral-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Return to Home"
              >
                <Home className="w-4 h-4 text-neutral-500" />
                <span>Home</span>
              </button>
              <span className="text-neutral-300">/</span>
            </>
          )}

          <button
            type="button"
            id="output-nav-back"
            onClick={onEditAgain}
            className="flex items-center gap-1 text-neutral-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Back to Editor"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Back to Editor</span>
          </button>

          <span className="text-neutral-300">/</span>

          <span className="text-emerald-700 font-bold px-1.5 py-0.5 bg-emerald-50 rounded-md">
            Download & Comparison
          </span>
        </div>

        {/* Reset / Start Over Button */}
        <button
          type="button"
          id="output-btn-reset"
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-red-700 bg-neutral-100 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-red-200 transition-colors cursor-pointer min-h-[36px]"
          title="Reset and start over with a fresh image"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Start Over</span>
        </button>
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Processing Complete
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Before & After Comparison
          </h2>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('after')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              viewMode === 'after'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Processed Image
          </button>
          <button
            type="button"
            onClick={() => setViewMode('before')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              viewMode === 'before'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden sm:block px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[36px] ${
              viewMode === 'split'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs mb-6">
        {/* Visual Canvas Area */}
        <div className="bg-neutral-900/95 p-4 sm:p-8 flex items-center justify-center min-h-[320px] max-h-[60vh] overflow-hidden">
          {viewMode === 'split' ? (
            <div className="grid grid-cols-2 gap-4 w-full h-full max-h-[50vh]">
              {/* Before */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-neutral-400 text-xs font-semibold mb-2 bg-neutral-800/80 px-2 py-0.5 rounded-full">
                  BEFORE: {originalMeta.width} × {originalMeta.height} px ({formatBytes(originalMeta.size)})
                </span>
                <img
                  src={originalMeta.srcUrl}
                  alt="Original preview"
                  className="max-h-[42vh] max-w-full object-contain rounded-lg border border-neutral-700"
                />
              </div>

              {/* After */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-blue-300 text-xs font-semibold mb-2 bg-blue-950/80 border border-blue-800/50 px-2 py-0.5 rounded-full">
                  AFTER: {processed.width} × {processed.height} px ({formatBytes(processed.size)})
                </span>
                <img
                  src={processed.url}
                  alt="Processed preview"
                  className="max-h-[42vh] max-w-full object-contain rounded-lg border border-blue-500/50 shadow-lg"
                />
              </div>
            </div>
          ) : viewMode === 'before' ? (
            <div className="flex flex-col items-center justify-center">
              <span className="text-neutral-400 text-xs font-semibold mb-2 bg-neutral-800/80 px-2.5 py-1 rounded-full">
                BEFORE: Original Image ({originalMeta.width} × {originalMeta.height} px • {formatBytes(originalMeta.size)})
              </span>
              <img
                src={originalMeta.srcUrl}
                alt="Original image preview"
                className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-blue-300 text-xs font-semibold mb-2 bg-blue-950/80 border border-blue-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                AFTER: Processed Image ({processed.width} × {processed.height} px • {formatBytes(processed.size)})
              </span>
              <img
                src={processed.url}
                alt="Processed output preview"
                className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-xl border border-white/10"
              />
            </div>
          )}
        </div>

        {/* Comparison Metrics Grid */}
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                Dimensions
              </span>
              <div className="text-sm font-extrabold text-neutral-900 font-mono">
                {processed.width} × {processed.height} px
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 font-mono">
                Original: {originalMeta.width} × {originalMeta.height}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                Format
              </span>
              <div className="text-sm font-extrabold text-neutral-900 uppercase font-mono">
                {processed.format}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 uppercase font-mono">
                Original: {originalMeta.extension}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                Output File Size
              </span>
              <div className="text-sm font-extrabold text-blue-700 font-mono">
                {formatBytes(processed.size)}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 font-mono">
                Original: {formatBytes(originalMeta.size)}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
                Size Change
              </span>
              <div
                className={`text-sm font-extrabold font-mono flex items-center gap-1 ${
                  isReduced ? 'text-emerald-600' : 'text-neutral-700'
                }`}
              >
                {isReduced ? `-${percentChange}%` : `+${percentChange}%`}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {isReduced ? `${formatBytes(sizeDelta)} saved` : 'Resolution changed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download & File Name Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <label
              htmlFor="input-final-filename"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
            >
              File Name (Before Download)
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="input-final-filename"
                value={downloadFilename}
                onChange={(e) => setDownloadFilename(sanitizeFileName(e.target.value))}
                placeholder="downloaded-image"
                className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-l-xl text-neutral-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white min-h-[44px]"
              />
              <span className="px-3.5 py-2.5 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-xl text-xs font-mono font-bold text-neutral-600 select-none min-h-[44px] flex items-center">
                .{processed.format}
              </span>
            </div>
          </div>

          {/* Real Download Button */}
          <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end">
            <button
              type="button"
              id="btn-download-image"
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-base shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              {hasDownloaded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Note below PNG download button */}
        {processed.format === 'png' && (
          <div className="mt-4 pt-3.5 border-t border-neutral-100">
            <p className="text-xs text-neutral-600 leading-relaxed bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-neutral-700">
              <span className="font-semibold text-amber-900">Note:</span> PNG is a high-quality format, so its size is larger than JPG. For smaller size with same quality, use JPG to WEBP.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons: Edit Again & Start Over */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          id="btn-start-over"
          onClick={onStartOver}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4 text-neutral-500" />
          <span>Start Over</span>
        </button>

        <button
          type="button"
          id="btn-edit-again"
          onClick={onEditAgain}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Again</span>
        </button>
      </div>
    </div>
  );
};
