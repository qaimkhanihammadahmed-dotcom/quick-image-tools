import React from 'react';
import { OutputConfig, SupportedFormat } from '../types';
import { FileType, Palette, Sliders, Check } from 'lucide-react';
import { sanitizeFileName } from '../utils/imageEngine';

interface OutputFormatPanelProps {
  config: OutputConfig;
  onChange: (config: OutputConfig) => void;
  onProcessImage: () => void;
}

const FORMAT_OPTIONS: { id: SupportedFormat; label: string; desc: string }[] = [
  { id: 'jpg', label: 'JPG', desc: 'Universal, best photo compression' },
  { id: 'png', label: 'PNG', desc: 'Preserves transparency & sharp graphics' },
  { id: 'webp', label: 'WEBP', desc: 'Modern web format, superior compression' },
];

const BG_COLOR_PRESETS = [
  { label: 'White', color: '#ffffff' },
  { label: 'Black', color: '#000000' },
  { label: 'Custom', color: 'custom' },
];

export const OutputFormatPanel: React.FC<OutputFormatPanelProps> = ({
  config,
  onChange,
  onProcessImage,
}) => {
  const handleFormatChange = (format: SupportedFormat) => {
    onChange({
      ...config,
      format,
    });
  };

  const handleFileNameChange = (val: string) => {
    // Keep it sanitized, user types filename without needing to worry about extension
    const clean = sanitizeFileName(val);
    onChange({
      ...config,
      fileName: clean,
    });
  };

  const handleBgColorPreset = (presetColor: string) => {
    if (presetColor === 'custom') {
      // Keep existing color or default to soft gray if currently white/black
      if (config.backgroundColor === '#ffffff' || config.backgroundColor === '#000000') {
        onChange({ ...config, backgroundColor: '#f3f4f6' });
      }
    } else {
      onChange({
        ...config,
        backgroundColor: presetColor,
      });
    }
  };

  const isJpg = config.format === 'jpg';
  const isPng = config.format === 'png';
  const isWebp = config.format === 'webp';
  const isCustomBg =
    config.backgroundColor !== '#ffffff' && config.backgroundColor !== '#000000';

  return (
    <div className="flex flex-col gap-5">
      {/* Format Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
          Select Output Format
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {FORMAT_OPTIONS.map((f) => {
            const isSelected = config.format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                id={`btn-format-${f.id}`}
                onClick={() => handleFormatChange(f.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-extrabold text-neutral-900">{f.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-tight">
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format-Specific Options */}
      {/* 1. JPG specific: Background color selector (because JPG lacks alpha transparency) */}
      {isJpg && (
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-blue-600" />
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              JPG Background Color
            </label>
          </div>
          <p className="text-xs text-neutral-500 mb-3">
            JPG does not support transparency. Transparent areas will be filled with this background:
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleBgColorPreset('#ffffff')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                config.backgroundColor === '#ffffff'
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-neutral-300 bg-white shadow-xs" />
              <span>White (Default)</span>
            </button>

            <button
              type="button"
              onClick={() => handleBgColorPreset('#000000')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                config.backgroundColor === '#000000'
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-neutral-800 bg-black shadow-xs" />
              <span>Black</span>
            </button>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                isCustomBg
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-neutral-200 bg-white text-neutral-700'
              }`}
            >
              <input
                type="color"
                id="input-custom-bg-color"
                value={config.backgroundColor}
                onChange={(e) =>
                  onChange({
                    ...config,
                    backgroundColor: e.target.value,
                  })
                }
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                title="Choose custom background color"
              />
              <label htmlFor="input-custom-bg-color" className="cursor-pointer">
                Custom ({config.backgroundColor.toUpperCase()})
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. PNG specific notice: 8-bit UPNG auto-compression & note */}
      {isPng && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
            <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              ✓
            </div>
            <div>
              <strong>Auto 8-Bit PNG Compression:</strong> PNG output is automatically converted to 8-bit (256 colors) using UPNG quantization and compressed. This prevents huge ~14MB files, reducing size down to ~1.5MB–2MB with crisp graphics.
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900">
            <span className="font-semibold">Note:</span> PNG is a high-quality format, so its size is larger than JPG. For smaller size with same quality, use JPG to WEBP.
          </div>
        </div>
      )}

      {/* 3. WEBP specific notice */}
      {isWebp && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-blue-800">
          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
            i
          </div>
          <div>
            <strong>Modern Web Standard:</strong> WEBP provides both transparency support and
            advanced lossy compression, resulting in 25–35% smaller file sizes than JPG.
          </div>
        </div>
      )}

      {/* Quality control for JPG & WEBP (0 to 100, default 80%) */}
      {(isJpg || isWebp) && (
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="slider-format-quality"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Quality ({config.format.toUpperCase()})
            </label>
            <div className="flex items-center gap-2">
              {config.quality !== 80 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...config, quality: 80 })}
                  className="text-[11px] text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                >
                  Reset to 80%
                </button>
              )}
              <span className="text-sm font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {config.quality}%
              </span>
            </div>
          </div>

          <input
            type="range"
            id="slider-format-quality"
            min="0"
            max="100"
            step="1"
            value={config.quality}
            onChange={(e) =>
              onChange({
                ...config,
                quality: parseInt(e.target.value, 10),
              })
            }
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2 mb-1 min-h-[32px]"
          />

          <div className="flex justify-between text-[11px] text-neutral-400 font-medium px-0.5">
            <span>0% (Smallest file)</span>
            <span>80% (Default)</span>
            <span>100% (Maximum)</span>
          </div>
        </div>
      )}

      {/* Output Filename Input */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200">
        <label
          htmlFor="input-output-filename"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Output File Name
        </label>
        <div className="flex items-center">
          <input
            type="text"
            id="input-output-filename"
            value={config.fileName}
            onChange={(e) => handleFileNameChange(e.target.value)}
            placeholder="my-image"
            className="flex-1 px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-l-lg text-neutral-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <span className="px-3.5 py-2.5 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-lg text-xs font-mono font-bold text-neutral-600 select-none">
            .{config.format}
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-1.5">
          The file extension is automatically managed and will not be duplicated.
        </p>
      </div>

      {/* Process & Preview Action Button */}
      <button
        type="button"
        id="btn-process-image"
        onClick={onProcessImage}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <FileType className="w-4 h-4" />
        <span>Generate Output Preview</span>
      </button>
    </div>
  );
};
