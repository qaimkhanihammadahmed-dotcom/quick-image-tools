import React, { useState } from 'react';
import { ResizeConfig } from '../types';
import { Lock, Unlock, Check, Sparkles, RotateCcw, Download, ArrowRight } from 'lucide-react';
import { formatBytes } from '../utils/imageEngine';

interface ResizePanelProps {
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  originalFormat: string;
  currentWidth: number;
  currentHeight: number;
  originalAspect: number; // width / height
  config: ResizeConfig;
  estimatedNewSize: number;
  targetFormat: string;
  onChange: (config: ResizeConfig) => void;
  onApplyResize: () => void;
  onResetResize: () => void;
  onQuickDownload: () => void;
}

const PRESETS = [
  { id: '1080x1080', label: '1080 × 1080', desc: 'Square (Instagram)', w: 1080, h: 1080 },
  { id: '1080x1350', label: '1080 × 1350', desc: 'Portrait (Instagram)', w: 1080, h: 1350 },
  { id: '1080x1920', label: '1080 × 1920', desc: 'Story / Reel / TikTok', w: 1080, h: 1920 },
  { id: '1920x1080', label: '1920 × 1080', desc: 'Full HD Landscape', w: 1920, h: 1080 },
  { id: '1200x628', label: '1200 × 628', desc: 'Social Banner / Ad', w: 1200, h: 628 },
  { id: 'custom', label: 'Custom', desc: 'Custom dimensions', w: 0, h: 0 },
];

export const ResizePanel: React.FC<ResizePanelProps> = ({
  originalWidth,
  originalHeight,
  originalSize,
  originalFormat,
  currentWidth,
  currentHeight,
  originalAspect,
  config,
  estimatedNewSize,
  targetFormat,
  onChange,
  onApplyResize,
  onResetResize,
  onQuickDownload,
}) => {
  const [appliedNotification, setAppliedNotification] = useState(false);

  const handleWidthChange = (valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val) || val <= 0) {
      onChange({
        ...config,
        width: 0,
        preset: 'custom',
      });
      return;
    }

    if (config.lockAspectRatio && originalAspect > 0) {
      const calculatedHeight = Math.max(1, Math.round(val / originalAspect));
      onChange({
        ...config,
        width: val,
        height: calculatedHeight,
        preset: 'custom',
      });
    } else {
      onChange({
        ...config,
        width: val,
        preset: 'custom',
      });
    }
  };

  const handleHeightChange = (valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val) || val <= 0) {
      onChange({
        ...config,
        height: 0,
        preset: 'custom',
      });
      return;
    }

    if (config.lockAspectRatio && originalAspect > 0) {
      const calculatedWidth = Math.max(1, Math.round(val * originalAspect));
      onChange({
        ...config,
        height: val,
        width: calculatedWidth,
        preset: 'custom',
      });
    } else {
      onChange({
        ...config,
        height: val,
        preset: 'custom',
      });
    }
  };

  const toggleLockAspectRatio = () => {
    const newLock = !config.lockAspectRatio;
    if (newLock && config.width > 0 && originalAspect > 0) {
      const calculatedHeight = Math.max(1, Math.round(config.width / originalAspect));
      onChange({
        ...config,
        lockAspectRatio: true,
        height: calculatedHeight,
      });
    } else {
      onChange({
        ...config,
        lockAspectRatio: newLock,
      });
    }
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    if (preset.id === 'custom') {
      onChange({
        ...config,
        preset: 'custom',
      });
      return;
    }

    onChange({
      ...config,
      width: preset.w,
      height: preset.h,
      preset: preset.id,
      lockAspectRatio: false,
    });
  };

  const handleApply = () => {
    onApplyResize();
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2000);
  };

  const sizeDelta = originalSize - estimatedNewSize;
  const isReduced = sizeDelta > 0;
  const percentDelta =
    originalSize > 0 ? Math.round((Math.abs(sizeDelta) / originalSize) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Requirement 5: IMPORTANT UI IMPROVEMENT - BEFORE & AFTER SIZE DISPLAY */}
      <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Dimension & Size Comparison
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isReduced ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isReduced ? `-${percentDelta}% file size` : 'Target Scale'}
          </span>
        </div>

        {/* Side-by-side on desktop, stacked vertically on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
          {/* BEFORE: Original Image */}
          <div
            id="resize-original-size-box"
            className="bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                Original Size
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md uppercase">
                {originalFormat}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base sm:text-lg font-extrabold text-neutral-900 font-mono">
                {originalWidth} × {originalHeight} px
              </div>
              <div className="text-xs sm:text-sm font-semibold text-neutral-600 font-mono">
                {formatBytes(originalSize)}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex justify-between">
              <span>Original Format:</span>
              <strong className="text-neutral-700 uppercase">{originalFormat}</strong>
            </div>
          </div>

          {/* AFTER: Resized Image */}
          <div
            id="resize-new-size-box"
            className="bg-blue-50/50 p-3.5 sm:p-4 rounded-xl border border-blue-200 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                New Size
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md uppercase">
                {targetFormat}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base sm:text-lg font-extrabold text-blue-900 font-mono">
                {config.width || 0} × {config.height || 0} px
              </div>
              <div className="text-xs sm:text-sm font-semibold text-blue-700 font-mono">
                {estimatedNewSize > 0 ? formatBytes(estimatedNewSize) : 'Calculating...'}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-blue-100 text-[11px] text-blue-800 flex justify-between">
              <span>New Format:</span>
              <strong className="text-blue-950 uppercase">{targetFormat}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Preset sizes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          Preset Dimensions
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const isSelected =
              config.preset === p.id ||
              (p.id !== 'custom' && config.width === p.w && config.height === p.h);

            return (
              <button
                key={p.id}
                type="button"
                id={`btn-preset-${p.id}`}
                onClick={() => handlePresetSelect(p)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer min-h-[52px] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{p.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[11px] text-neutral-500 truncate mt-0.5">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Width and Height Custom Inputs */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Dimensions (Pixels)
          </label>
          <button
            type="button"
            id="btn-lock-aspect-ratio"
            onClick={toggleLockAspectRatio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
              config.lockAspectRatio
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
            title={
              config.lockAspectRatio
                ? 'Aspect ratio locked. Changes to width will update height automatically.'
                : 'Aspect ratio unlocked.'
            }
          >
            {config.lockAspectRatio ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Locked ({originalAspect.toFixed(2)}:1)</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlocked</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <label
              htmlFor="input-resize-width"
              className="block text-xs font-medium text-neutral-600 mb-1"
            >
              Width (px)
            </label>
            <input
              type="number"
              id="input-resize-width"
              min="1"
              max="10000"
              value={config.width || ''}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="input-resize-height"
              className="block text-xs font-medium text-neutral-600 mb-1"
            >
              Height (px)
            </label>
            <input
              type="number"
              id="input-resize-height"
              min="1"
              max="10000"
              value={config.height || ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Resize Action Buttons (Apply, Reset, Download) */}
      <div className="flex flex-col gap-2.5">
        {/* Resize / Apply button */}
        <button
          type="button"
          id="btn-apply-resize"
          onClick={handleApply}
          disabled={!config.width || !config.height}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          {appliedNotification ? (
            <>
              <Check className="w-4 h-4" />
              <span>Resized Successfully!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Resize Image</span>
            </>
          )}
        </button>

        {/* Secondary controls: Reset Dimensions & Quick Download */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            id="btn-reset-dimensions"
            onClick={onResetResize}
            className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200/80 active:bg-neutral-300 text-neutral-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            title="Reset dimensions back to original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dimensions</span>
          </button>

          <button
            type="button"
            id="btn-quick-download-resize"
            onClick={onQuickDownload}
            className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
            title="Process and download this resized image immediately"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
