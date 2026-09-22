import React, { useState } from 'react';
import { SupportedFormat } from '../types';
import { Sliders, ArrowDownRight, Check, Zap, Sparkles } from 'lucide-react';
import { formatBytes } from '../utils/imageEngine';

interface CompressPanelProps {
  quality: number; // 10 to 100
  originalSize: number;
  estimatedSize: number;
  currentFormat: SupportedFormat;
  onChangeQuality: (quality: number) => void;
  onApplyCompress: () => void;
}

export const CompressPanel: React.FC<CompressPanelProps> = ({
  quality,
  originalSize,
  estimatedSize,
  currentFormat,
  onChangeQuality,
  onApplyCompress,
}) => {
  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleApply = () => {
    onApplyCompress();
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2000);
  };

  const isPng = currentFormat === 'png';
  const sizeDiff = originalSize - estimatedSize;
  const isReduced = sizeDiff > 0;
  const percentSaved =
    originalSize > 0 ? Math.round((Math.abs(sizeDiff) / originalSize) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Explicit Compression Results Card matching Requirement 9 */}
      <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold uppercase tracking-wider text-neutral-500">
            Compression Analysis
          </span>
          <span
            className={`font-semibold px-2.5 py-0.5 rounded-full ${
              isReduced
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            {isReduced ? `Reduced by: ${percentSaved}%` : 'Unchanged'}
          </span>
        </div>

        {/* 3-Part Metric Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide block mb-0.5">
              Original
            </span>
            <span className="text-base font-extrabold text-neutral-800 font-mono">
              {formatBytes(originalSize)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block mb-0.5">
              New
            </span>
            <span className="text-base font-extrabold text-blue-900 font-mono">
              {estimatedSize > 0 ? formatBytes(estimatedSize) : 'Calculating...'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block mb-0.5">
              Reduced By
            </span>
            <span
              className={`text-base font-extrabold font-mono ${
                isReduced ? 'text-emerald-700' : 'text-neutral-700'
              }`}
            >
              {isReduced ? `${percentSaved}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Quality Slider Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="slider-image-quality"
            className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Image Quality
          </label>
          <span className="text-sm font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
            {quality}%
          </span>
        </div>

        {isPng ? (
          <div className="space-y-3 mt-2">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed">
              <strong>Auto 8-Bit PNG Compression:</strong> PNG images are automatically compressed into 8-bit (256 colors) using UPNG quantization. This dramatically reduces size (e.g. from ~14MB down to ~1.5MB–2MB) with no visible quality loss for logos, icons, and text images.
            </div>
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold">Note:</span> PNG is a high-quality format, so its size is larger than JPG. For smaller size with same quality, use JPG to WEBP.
            </div>
          </div>
        ) : (
          <>
            <input
              type="range"
              id="slider-image-quality"
              min="0"
              max="100"
              step="1"
              value={quality}
              onChange={(e) => onChangeQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3 mb-1 min-h-[32px]"
            />

            <div className="flex justify-between text-[11px] text-neutral-400 font-medium px-0.5">
              <span>0% (Smallest file)</span>
              <span>50% (Balanced)</span>
              <span>80% (Default)</span>
              <span>100% (Maximum)</span>
            </div>

            <p className="text-xs text-neutral-500 mt-3 italic font-medium">
              &quot;Lower quality = smaller file size (Default: 80%)&quot;
            </p>
          </>
        )}
      </div>

      {/* Quick Presets for Quality */}
      {!isPng && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Quick Quality:</span>
          {[
            { label: 'Low (40%)', val: 40 },
            { label: 'Medium (65%)', val: 65 },
            { label: 'High (80%)', val: 80 },
            { label: 'Ultra (95%)', val: 95 },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => onChangeQuality(preset.val)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer min-h-[36px] ${
                quality === preset.val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Apply / Process Button */}
      <button
        type="button"
        id="btn-apply-compression"
        onClick={handleApply}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
      >
        {appliedNotification ? (
          <>
            <Check className="w-4 h-4" />
            <span>Compression Applied!</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Compress & Apply</span>
          </>
        )}
      </button>
    </div>
  );
};
