import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AspectRatioPreset, CropRect } from '../types';
import { Check, X, Crop as CropIcon, Eye } from 'lucide-react';

interface CropToolProps {
  imageSrc: string;
  originalWidth: number;
  originalHeight: number;
  initialCrop?: CropRect | null;
  onApplyCrop: (crop: CropRect) => void;
  onCancelCrop: () => void;
}

const PRESET_RATIOS: { id: AspectRatioPreset; label: string; ratio: number | null }[] = [
  { id: 'free', label: 'Free', ratio: null },
  { id: '1:1', label: '1:1 Square', ratio: 1 },
  { id: '4:5', label: '4:5 Social', ratio: 4 / 5 },
  { id: '16:9', label: '16:9 Wide', ratio: 16 / 9 },
  { id: '9:16', label: '9:16 Story', ratio: 9 / 16 },
  { id: '3:2', label: '3:2 Photo', ratio: 3 / 2 },
];

export const CropTool: React.FC<CropToolProps> = ({
  imageSrc,
  originalWidth,
  originalHeight,
  initialCrop,
  onApplyCrop,
  onCancelCrop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<AspectRatioPreset>('free');

  // Crop box in percentage (0..100)
  const [crop, setCrop] = useState<CropRect>(
    initialCrop || {
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    }
  );

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const dragActionRef = useRef<{
    type: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);

  // Helper to adjust crop to match aspect ratio
  const applyAspectRatio = useCallback((preset: AspectRatioPreset) => {
    setActivePreset(preset);
    const item = PRESET_RATIOS.find((p) => p.id === preset);
    if (!item || item.ratio === null) return; // Free crop

    const targetRatio = item.ratio;
    // targetRatio = cropPixelWidth / cropPixelHeight
    // cropPixelWidth = (crop.w / 100) * originalWidth
    // cropPixelHeight = (crop.h / 100) * originalHeight
    // targetRatio = (w * originalWidth) / (h * originalHeight)
    // => h = (w * originalWidth) / (originalHeight * targetRatio)

    setCrop((prev) => {
      let newW = prev.width;
      let newH = (newW * originalWidth) / (originalHeight * targetRatio);

      if (newH > 90) {
        newH = 90;
        newW = (newH * originalHeight * targetRatio) / originalWidth;
      }
      if (newW > 90) {
        newW = 90;
        newH = (newW * originalWidth) / (originalHeight * targetRatio);
      }

      // Center it
      const newX = Math.max(0, Math.min(100 - newW, 50 - newW / 2));
      const newY = Math.max(0, Math.min(100 - newH, 50 - newH / 2));

      return {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH),
      };
    });
  }, [originalWidth, originalHeight]);

  const handlePointerDown = (
    e: React.PointerEvent,
    actionType: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsInteracting(true);
    dragActionRef.current = {
      type: actionType,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragActionRef.current || !containerRef.current) return;
    const { type, startX, startY, startCrop } = dragActionRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = ((e.clientX - startX) / rect.width) * 100;
    const deltaY = ((e.clientY - startY) / rect.height) * 100;

    let next = { ...startCrop };

    if (type === 'move') {
      next.x = Math.max(0, Math.min(100 - startCrop.width, startCrop.x + deltaX));
      next.y = Math.max(0, Math.min(100 - startCrop.height, startCrop.y + deltaY));
    } else {
      // Resizing handles
      if (type.includes('e')) {
        next.width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      }
      if (type.includes('s')) {
        next.height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + deltaY));
      }
      if (type.includes('w')) {
        const potentialW = startCrop.width - deltaX;
        if (potentialW >= 10 && startCrop.x + deltaX >= 0) {
          next.x = startCrop.x + deltaX;
          next.width = potentialW;
        }
      }
      if (type.includes('n')) {
        const potentialH = startCrop.height - deltaY;
        if (potentialH >= 10 && startCrop.y + deltaY >= 0) {
          next.y = startCrop.y + deltaY;
          next.height = potentialH;
        }
      }

      // Enforce aspect ratio if not 'free'
      const activePresetObj = PRESET_RATIOS.find((p) => p.id === activePreset);
      if (activePresetObj && activePresetObj.ratio !== null) {
        const targetRatio = activePresetObj.ratio;
        // Adjust height based on width
        const desiredH = (next.width * originalWidth) / (originalHeight * targetRatio);
        if (next.y + desiredH <= 100) {
          next.height = desiredH;
        } else {
          next.height = 100 - next.y;
          next.width = (next.height * originalHeight * targetRatio) / originalWidth;
        }
      }
    }

    setCrop({
      x: Math.round(next.x * 10) / 10,
      y: Math.round(next.y * 10) / 10,
      width: Math.round(next.width * 10) / 10,
      height: Math.round(next.height * 10) / 10,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragActionRef.current) {
      dragActionRef.current = null;
      setIsInteracting(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe to ignore if already released
      }
    }
  };

  // Calculate cropped pixel values
  const croppedPxW = Math.round((crop.width / 100) * originalWidth);
  const croppedPxH = Math.round((crop.height / 100) * originalHeight);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top Controls: Aspect Ratio Buttons */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <CropIcon className="w-3.5 h-3.5 text-blue-600" />
            Aspect Ratio Presets
          </label>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {croppedPxW} × {croppedPxH} px
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PRESET_RATIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`crop-preset-${preset.id}`}
              onClick={() => applyAspectRatio(preset.id)}
              className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border text-center ${
                activePreset === preset.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Crop Stage */}
      <div className="relative w-full bg-neutral-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center select-none p-2">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative max-w-full max-h-[60vh] overflow-hidden inline-block touch-none"
        >
          {/* Base Image */}
          <img
            src={imageSrc}
            alt="Crop area preview"
            className="block max-w-full max-h-[60vh] object-contain pointer-events-none select-none"
          />

          {/* Dark Overlay around crop box */}
          <div
            className="absolute inset-0 bg-black/60 pointer-events-none"
            style={{
              clipPath: `polygon(
                0% 0%, 0% 100%, 
                ${crop.x}% 100%, 
                ${crop.x}% ${crop.y}%, 
                ${crop.x + crop.width}% ${crop.y}%, 
                ${crop.x + crop.width}% ${crop.y + crop.height}%, 
                ${crop.x}% ${crop.y + crop.height}%, 
                ${crop.x}% 100%, 
                100% 100%, 100% 0%
              )`,
            }}
          />

          {/* Interactive Crop Boundary Box */}
          <div
            className="absolute border-2 border-white shadow-sm cursor-move touch-none"
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          >
            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Live Size Pill in Center */}
            <div className="absolute top-2 left-2 pointer-events-none bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-1.5 py-0.5 rounded shadow-sm">
              {croppedPxW} × {croppedPxH}
            </div>

            {/* Corner Resize Handles with min 44px tap zone */}
            {/* Top-Left */}
            <div
              className="absolute -top-3 -left-3 w-7 h-7 flex items-center justify-center cursor-nwse-resize z-20"
              onPointerDown={(e) => handlePointerDown(e, 'nw')}
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md" />
            </div>

            {/* Top-Right */}
            <div
              className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center cursor-nesw-resize z-20"
              onPointerDown={(e) => handlePointerDown(e, 'ne')}
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md" />
            </div>

            {/* Bottom-Right */}
            <div
              className="absolute -bottom-3 -right-3 w-7 h-7 flex items-center justify-center cursor-nwse-resize z-20"
              onPointerDown={(e) => handlePointerDown(e, 'se')}
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md" />
            </div>

            {/* Bottom-Left */}
            <div
              className="absolute -bottom-3 -left-3 w-7 h-7 flex items-center justify-center cursor-nesw-resize z-20"
              onPointerDown={(e) => handlePointerDown(e, 'sw')}
            >
              <div className="w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200">
        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Eye className="w-4 h-4 text-neutral-500" />
          <span>Preview Crop</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="btn-cancel-crop"
            onClick={onCancelCrop}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            id="btn-apply-crop"
            onClick={() => onApplyCrop(crop)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop</span>
          </button>
        </div>
      </div>

      {/* Preview Crop Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Crop Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-neutral-500 hover:text-neutral-800 p-1"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[50vh] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 flex items-center justify-center relative p-2">
              <div
                className="overflow-hidden shadow-md"
                style={{
                  aspectRatio: `${croppedPxW} / ${croppedPxH}`,
                  maxWidth: '100%',
                  maxHeight: '45vh',
                }}
              >
                {/* CSS simulated crop preview */}
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt="Cropped Preview"
                    style={{
                      position: 'absolute',
                      width: `${(100 / crop.width) * 100}%`,
                      height: `${(100 / crop.height) * 100}%`,
                      left: `-${(crop.x / crop.width) * 100}%`,
                      top: `-${(crop.y / crop.height) * 100}%`,
                      maxWidth: 'none',
                      maxHeight: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-500 mt-3 text-center">
              Output dimensions: <strong className="text-neutral-800">{croppedPxW} × {croppedPxH} px</strong>
            </div>

            <div className="w-full flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 font-semibold text-sm hover:bg-neutral-50"
              >
                Back to Editing
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onApplyCrop(crop);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
