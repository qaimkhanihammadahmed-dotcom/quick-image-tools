import React from 'react';
import { TransformConfig } from '../types';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Rotate3D } from 'lucide-react';

interface RotateFlipPanelProps {
  transform: TransformConfig;
  onChange: (transform: TransformConfig) => void;
  onDimensionsInverted?: () => void;
}

export const RotateFlipPanel: React.FC<RotateFlipPanelProps> = ({
  transform,
  onChange,
  onDimensionsInverted,
}) => {
  const handleRotateLeft = () => {
    const newRotation = (transform.rotation - 90 + 360) % 360;
    onChange({
      ...transform,
      rotation: newRotation,
    });
    onDimensionsInverted?.();
  };

  const handleRotateRight = () => {
    const newRotation = (transform.rotation + 90) % 360;
    onChange({
      ...transform,
      rotation: newRotation,
    });
    onDimensionsInverted?.();
  };

  const handleFlipHorizontal = () => {
    onChange({
      ...transform,
      flipH: !transform.flipH,
    });
  };

  const handleFlipVertical = () => {
    onChange({
      ...transform,
      flipV: !transform.flipV,
    });
  };

  const handleReset = () => {
    const hadRotated90or270 = transform.rotation === 90 || transform.rotation === 270;
    onChange({
      rotation: 0,
      flipH: false,
      flipV: false,
    });
    if (hadRotated90or270) {
      onDimensionsInverted?.();
    }
  };

  const hasModifications =
    transform.rotation !== 0 || transform.flipH || transform.flipV;

  return (
    <div className="flex flex-col gap-5">
      {/* Current Orientation status */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-neutral-700">
          <Rotate3D className="w-4 h-4 text-blue-600" />
          <span>
            Rotation: <strong className="font-semibold">{transform.rotation}°</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          {transform.flipH && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              Flipped H
            </span>
          )}
          {transform.flipV && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              Flipped V
            </span>
          )}
          {!hasModifications && <span>Default orientation</span>}
        </div>
      </div>

      {/* Rotate Section */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
          Rotate
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-rotate-left"
            onClick={handleRotateLeft}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span>Rotate Left (90°)</span>
          </button>

          <button
            type="button"
            id="btn-rotate-right"
            onClick={handleRotateRight}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 font-semibold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-blue-600" />
            <span>Rotate Right (90°)</span>
          </button>
        </div>
      </div>

      {/* Flip Section */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
          Flip
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-flip-horizontal"
            onClick={handleFlipHorizontal}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${
              transform.flipH
                ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs'
            }`}
          >
            <FlipHorizontal className="w-4 h-4 text-blue-600" />
            <span>Flip Horizontal</span>
          </button>

          <button
            type="button"
            id="btn-flip-vertical"
            onClick={handleFlipVertical}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-colors cursor-pointer ${
              transform.flipV
                ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs'
            }`}
          >
            <FlipVertical className="w-4 h-4 text-blue-600" />
            <span>Flip Vertical</span>
          </button>
        </div>
      </div>

      {/* Reset button if modified */}
      {hasModifications && (
        <button
          type="button"
          id="btn-reset-transforms"
          onClick={handleReset}
          className="py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 text-center cursor-pointer transition-colors"
        >
          Reset Orientation to Normal
        </button>
      )}
    </div>
  );
};
