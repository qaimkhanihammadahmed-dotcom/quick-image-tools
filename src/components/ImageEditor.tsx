import React, { useState, useEffect } from 'react';
import {
  ImageMeta,
  ResizeConfig,
  TransformConfig,
  OutputConfig,
  CropRect,
  EditorTab,
  ProcessedOutput,
} from '../types';
import {
  Minimize2,
  Scissors,
  RefreshCw,
  Image as ImageIcon,
  ArrowLeftRight,
  Download,
  Loader2,
  RotateCcw,
  Sparkles,
  Home,
  ArrowLeft,
  Eraser,
} from 'lucide-react';
import { ResizePanel } from './ResizePanel';
import { RotateFlipPanel } from './RotateFlipPanel';
import { CompressPanel } from './CompressPanel';
import { OutputFormatPanel } from './OutputFormatPanel';
import { CropTool } from './CropTool';
import  BackgroundRemoverPanel  from './BackgroundRemoverPanel';
import {
  formatBytes,
  renderImageToCanvas,
  canvasToBlob,
  estimateOutputSize,
  loadImage,
  sanitizeFileName,
} from '../utils/imageEngine';

interface ImageEditorProps {
  meta: ImageMeta;
  initialTab?: EditorTab;
  onProcessed: (result: ProcessedOutput) => void;
  onStartOver: () => void;
  onGoHome: () => void;
  onGoBack: () => void;
  onTabChange?: (tab: EditorTab) => void;
  onImageUpdated: (result: Blob) => Promise<void> | void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  meta,
  initialTab = 'resize',
  onProcessed,
  onStartOver,
  onGoHome,
  onGoBack,
  onTabChange,
  onImageUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab);
  const [tabHistory, setTabHistory] = useState<EditorTab[]>([initialTab]);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Sync initial tab if parent changes it
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Transformations & Configuration States
  const [appliedCrop, setAppliedCrop] = useState<CropRect | null>(null);
  const [isCroppingActive, setIsCroppingActive] = useState(false);

  const [transform, setTransform] = useState<TransformConfig>({
    rotation: 0,
    flipH: false,
    flipV: false,
  });

  // Calculate effective dimensions based on applied crop and rotation
  const isRotated90 = transform.rotation === 90 || transform.rotation === 270;
  const baseCropW = appliedCrop ? Math.round((appliedCrop.width / 100) * meta.width) : meta.width;
  const baseCropH = appliedCrop ? Math.round((appliedCrop.height / 100) * meta.height) : meta.height;

  const currentW = isRotated90 ? baseCropH : baseCropW;
  const currentH = isRotated90 ? baseCropW : baseCropH;
  const currentAspect = currentW / (currentH || 1);

  const [resizeConfig, setResizeConfig] = useState<ResizeConfig>({
    width: currentW,
    height: currentH,
    lockAspectRatio: true,
    preset: 'custom',
  });

  const [outputConfig, setOutputConfig] = useState<OutputConfig>({
    format: (meta.extension.toLowerCase() === 'png'
      ? 'png'
      : meta.extension.toLowerCase() === 'webp'
      ? 'webp'
      : 'jpg') as OutputConfig['format'],
    quality: 80,
    backgroundColor: '#ffffff',
    fileName: `${meta.name}-edited`,
  });

  const [estimatedSize, setEstimatedSize] = useState<number>(meta.size);

  // Load original image into HTMLImageElement
  useEffect(() => {
    loadImage(meta.srcUrl)
      .then((img) => {
        setImgElement(img);
      })
      .catch((err) => {
        setProcessingError(err.message || 'Failed to read image.');
      });
  }, [meta.srcUrl]);

  // Track tab changes for smart Back navigation without loops
  const handleSwitchTab = (newTab: EditorTab) => {
    if (newTab !== activeTab) {
      setTabHistory((prev) => [...prev.slice(-4), newTab]);
      setActiveTab(newTab);
      onTabChange?.(newTab);
    }
  };

  // Back button handler inside editor
  const handleEditorBack = () => {
    if (isCroppingActive) {
      setIsCroppingActive(false);
      return;
    }
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // remove current
      const prevTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(prevTab);
    } else {
      onGoBack();
    }
  };

  // Recalculate estimated size when parameters change
  useEffect(() => {
    if (!imgElement) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const size = await estimateOutputSize({
          img: imgElement,
          crop: appliedCrop,
          transform,
          targetWidth: resizeConfig.width || currentW,
          targetHeight: resizeConfig.height || currentH,
          format: outputConfig.format,
          quality: outputConfig.quality,
          backgroundColor: outputConfig.backgroundColor,
        });
        if (isMounted) {
          setEstimatedSize(size);
        }
      } catch (e) {
        console.warn('Size estimation failed', e);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    imgElement,
    appliedCrop,
    transform,
    resizeConfig.width,
    resizeConfig.height,
    outputConfig.format,
    outputConfig.quality,
    outputConfig.backgroundColor,
    currentW,
    currentH,
  ]);

  // Handle Rotation 90/270 dimension inversion
  const handleDimensionsInverted = () => {
    setResizeConfig((prev) => ({
      ...prev,
      width: prev.height,
      height: prev.width,
    }));
  };

  // Handle Applying Crop
  const handleApplyCrop = (crop: CropRect) => {
    setAppliedCrop(crop);
    setIsCroppingActive(false);

    // Calculate new cropped dimensions
    const croppedWidth = Math.round((crop.width / 100) * meta.width);
    const croppedHeight = Math.round((crop.height / 100) * meta.height);
    const newW = isRotated90 ? croppedHeight : croppedWidth;
    const newH = isRotated90 ? croppedWidth : croppedHeight;

    setResizeConfig((prev) => ({
      ...prev,
      width: newW,
      height: newH,
      preset: 'custom',
    }));

    if (!outputConfig.fileName.includes('cropped')) {
      setOutputConfig((prev) => ({
        ...prev,
        fileName: `${sanitizeFileName(meta.name)}-cropped`,
      }));
    }
  };

  const handleResetCrop = () => {
    setAppliedCrop(null);
    setIsCroppingActive(false);
    const newW = isRotated90 ? meta.height : meta.width;
    const newH = isRotated90 ? meta.width : meta.height;
    setResizeConfig((prev) => ({
      ...prev,
      width: newW,
      height: newH,
      preset: 'custom',
    }));
  };

  // Reset Resize dimensions back to current aspect/crop
  const handleResetResize = () => {
    setResizeConfig({
      width: currentW,
      height: currentH,
      lockAspectRatio: true,
      preset: 'custom',
    });
  };

  // Main processing pipeline
  const handleProcessAndExport = async (customTag?: string) => {
    if (!imgElement) return;

    try {
      setIsProcessing(true);
      setProcessingError(null);

      let finalName = sanitizeFileName(outputConfig.fileName);
      if (customTag && (!finalName || finalName === `${meta.name}-edited`)) {
        finalName = `${sanitizeFileName(meta.name)}-${customTag}`;
      }

      const canvas = renderImageToCanvas({
        img: imgElement,
        crop: appliedCrop,
        transform,
        targetWidth: resizeConfig.width || currentW,
        targetHeight: resizeConfig.height || currentH,
        format: outputConfig.format,
        quality: outputConfig.quality,
        backgroundColor: outputConfig.backgroundColor,
      });

      const blob = await canvasToBlob(canvas, outputConfig.format, outputConfig.quality);
      const url = URL.createObjectURL(blob);

      onProcessed({
        blob,
        url,
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
        format: outputConfig.format,
        filename: finalName,
      });
    } catch (err: any) {
      setProcessingError(
        err.message || 'Image processing failed. Try reducing dimensions or quality.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getToolDisplayName = (tab: EditorTab) => {
    switch (tab) {
      case 'resize':
        return 'Resize Image';
      case 'crop':
        return 'Crop Image';
      case 'rotate':
        return 'Rotate & Flip';
      case 'compress':
        return 'Compress Image';
      case 'output':
        return 'Convert Image';
      case 'background-remover':
        return 'Remove Background';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* 1. REQUIREMENT 2: HOME AND BACK NAVIGATION BAR */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center justify-between mb-4 bg-white px-3 sm:px-4 py-2.5 rounded-xl border border-neutral-200 shadow-2xs select-none"
      >
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            id="editor-nav-home"
            onClick={onGoHome}
            className="flex items-center gap-1 text-neutral-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <Home className="w-4 h-4 text-neutral-500" />
            <span>Home</span>
          </button>

          <span className="text-neutral-300">/</span>

          <button
            type="button"
            id="editor-nav-back"
            onClick={handleEditorBack}
            className="flex items-center gap-1 text-neutral-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Back to previous page or upload"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Back</span>
          </button>

          <span className="text-neutral-300">/</span>

          <span className="text-blue-600 font-bold px-1.5 py-0.5 bg-blue-50 rounded-md">
            {getToolDisplayName(activeTab)}
          </span>
        </div>

        {/* Start Over / Reset Button */}
        <button
          type="button"
          id="editor-btn-reset"
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-red-700 bg-neutral-100 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-red-200 transition-colors cursor-pointer min-h-[36px]"
          title="Clear all image edits and choose another image"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tool</span>
        </button>
      </nav>

      {/* Top Original Image Details Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 mb-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {meta.extension}
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-neutral-900 truncate" title={meta.file.name}>
              {meta.file.name}
            </h2>
            <div className="flex items-center gap-2 text-neutral-500 font-medium mt-0.5">
              <span>{meta.mimeType}</span>
              <span>•</span>
              <span>
                {meta.width} × {meta.height} px
              </span>
              <span>•</span>
              <span>{formatBytes(meta.size)}</span>
            </div>
          </div>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="btn-quick-export"
            disabled={isProcessing || !imgElement}
            onClick={() => handleProcessAndExport()}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Process & Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Processing Error Banner */}
      {processingError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start justify-between">
          <span>{processingError}</span>
          <button
            type="button"
            onClick={() => setProcessingError(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Prominent Image Preview & Stage */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Main Visual Canvas Container */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xs relative flex items-center justify-center p-3 sm:p-6 min-h-[320px] sm:min-h-[460px]">
            {isCroppingActive ? (
              <CropTool
                imageSrc={meta.srcUrl}
                originalWidth={meta.width}
                originalHeight={meta.height}
                initialCrop={appliedCrop}
                onApplyCrop={handleApplyCrop}
                onCancelCrop={() => setIsCroppingActive(false)}
              />
            ) : (
              <div className="relative max-w-full max-h-[58vh] flex items-center justify-center overflow-hidden">
                {/* Live Transformed Preview Image */}
                <div
                  className="relative transition-transform duration-200 ease-out flex items-center justify-center"
                  style={{
                    transform: `rotate(${transform.rotation}deg) scaleX(${
                      transform.flipH ? -1 : 1
                    }) scaleY(${transform.flipV ? -1 : 1})`,
                  }}
                >
                  {appliedCrop ? (
                    <div
                      className="overflow-hidden border border-white/20 shadow-2xl relative"
                      style={{
                        width: `${Math.min(
                          500,
                          Math.round((appliedCrop.width / 100) * meta.width)
                        )}px`,
                        aspectRatio: `${appliedCrop.width} / ${appliedCrop.height}`,
                        maxHeight: '52vh',
                        maxWidth: '100%',
                      }}
                    >
                      <img
                        src={meta.srcUrl}
                        alt="Cropped live preview"
                        style={{
                          position: 'absolute',
                          width: `${(100 / appliedCrop.width) * 100}%`,
                          height: `${(100 / appliedCrop.height) * 100}%`,
                          left: `-${(appliedCrop.x / appliedCrop.width) * 100}%`,
                          top: `-${(appliedCrop.y / appliedCrop.height) * 100}%`,
                          maxWidth: 'none',
                          maxHeight: 'none',
                        }}
                      />
                    </div>
                  ) : (
                    <img
                      src={meta.srcUrl}
                      alt="Current preview"
                      className="max-h-[52vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10 select-none"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Overlaid Badges on Preview */}
            {!isCroppingActive && (
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                  Target: {resizeConfig.width || currentW} × {resizeConfig.height || currentH} px
                </span>
                {appliedCrop && (
                  <span className="bg-blue-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
                    Cropped
                  </span>
                )}
                {transform.rotation !== 0 && (
                  <span className="bg-neutral-800/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
                    {transform.rotation}°
                  </span>
                )}
              </div>
            )}

            {/* Crop Reset shortcut if crop is applied */}
            {!isCroppingActive && appliedCrop && (
              <button
                type="button"
                onClick={handleResetCrop}
                className="absolute bottom-3 left-3 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                title="Remove crop selection"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Remove Crop</span>
              </button>
            )}
          </div>

          {/* Quick Info bar below preview */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Real-time canvas modifications
            </span>
            <span>
              Est. Output Size:{' '}
              <strong className="text-neutral-800 font-mono font-semibold">
                {estimatedSize > 0 ? formatBytes(estimatedSize) : 'Calculating...'}
              </strong>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Tool Control Panels */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tool Tabs Segmented Control */}
          <div className="bg-neutral-100 p-1 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              id="tab-btn-resize"
              onClick={() => {
                handleSwitchTab('resize');
                setIsCroppingActive(false);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'resize' && !isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Resize</span>
            </button>

            <button
              type="button"
              id="tab-btn-crop"
              onClick={() => {
                handleSwitchTab('crop');
                setIsCroppingActive(true);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'crop' || isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Crop</span>
            </button>

            <button
              type="button"
              id="tab-btn-rotate"
              onClick={() => {
                handleSwitchTab('rotate');
                setIsCroppingActive(false);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'rotate' && !isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>

            <button
              type="button"
              id="tab-btn-compress"
              onClick={() => {
                handleSwitchTab('compress');
                setIsCroppingActive(false);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'compress' && !isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Compress</span>
            </button>

            <button
              type="button"
              id="tab-btn-output"
              onClick={() => {
                handleSwitchTab('output');
                setIsCroppingActive(false);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'output' && !isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Convert</span>
            </button>

            <button
              type="button"
              id="tab-btn-background-remover"
              onClick={() => {
                handleSwitchTab('background-remover');
                setIsCroppingActive(false);
              }}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                activeTab === 'background-remover' && !isCroppingActive
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Remove BG</span>
            </button>
          </div>

          {/* Active Tool Content Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-xs">
            {isCroppingActive || activeTab === 'crop' ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                  <Scissors className="w-4 h-4 text-blue-600" />
                  <span>Crop Image</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Drag the corner handles directly on the image, or select one of the aspect ratio
                  presets (Free, 1:1, 4:5, 16:9, 9:16, 3:2).
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCroppingActive(false)}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Close Crop View
                  </button>
                </div>
              </div>
            ) : activeTab === 'resize' ? (
              <ResizePanel
                originalWidth={meta.width}
                originalHeight={meta.height}
                originalSize={meta.size}
                originalFormat={meta.extension}
                currentWidth={currentW}
                currentHeight={currentH}
                originalAspect={currentAspect}
                config={resizeConfig}
                estimatedNewSize={estimatedSize}
                targetFormat={outputConfig.format}
                onChange={setResizeConfig}
                onApplyResize={() => handleProcessAndExport('resized')}
                onResetResize={handleResetResize}
                onQuickDownload={() => handleProcessAndExport('resized')}
              />
            ) : activeTab === 'rotate' ? (
              <RotateFlipPanel
                transform={transform}
                onChange={setTransform}
                onDimensionsInverted={handleDimensionsInverted}
              />
            ) : activeTab === 'compress' ? (
              <CompressPanel
                quality={outputConfig.quality}
                originalSize={meta.size}
                estimatedSize={estimatedSize}
                currentFormat={outputConfig.format}
                onChangeQuality={(q) =>
                  setOutputConfig((prev) => ({
                    ...prev,
                    quality: q,
                  }))
                }
                onApplyCompress={() => handleProcessAndExport('compressed')}
              />
            ) : activeTab === 'background-remover' ? (
              <BackgroundRemoverPanel imageMeta={meta} onImageReady={onImageUpdated} />
            ) : (
              <OutputFormatPanel
                config={outputConfig}
                onChange={setOutputConfig}
                onProcessImage={() => handleProcessAndExport('converted')}
              />
            )}
          </div>

          {/* Related Tools Internal Workflow Links */}
          <div className="mt-3 p-3.5 bg-neutral-100/80 rounded-xl border border-neutral-200/70 text-xs text-neutral-600">
            <span className="font-bold text-neutral-800 block mb-1">Related Tool Workflow:</span>
            {(activeTab === 'resize' && !isCroppingActive) && (
              <p>
                Need a smaller file size after resizing? Switch to{' '}
                <a
                  href="/compress-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('compress');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Compress Image
                </a>{' '}
                or adjust photo framing with{' '}
                <a
                  href="/crop-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('crop');
                    setIsCroppingActive(true);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Crop Image
                </a>.
              </p>
            )}
            {(activeTab === 'compress' && !isCroppingActive) && (
              <p>
                Looking for smaller file sizes? Switch format with{' '}
                <a
                  href="/convert-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('output');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Convert Image
                </a>{' '}
                or reduce pixel dimensions using{' '}
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('resize');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Resize Image
                </a>.
              </p>
            )}
            {(activeTab === 'crop' || isCroppingActive) && (
              <p>
                After cropping, set target pixel dimensions with{' '}
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('resize');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Resize Image
                </a>{' '}
                or optimize file size with{' '}
                <a
                  href="/compress-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('compress');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Compress Image
                </a>.
              </p>
            )}
            {(activeTab === 'output' && !isCroppingActive) && (
              <p>
                Fine-tune compression quality using{' '}
                <a
                  href="/compress-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('compress');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Compress Image
                </a>{' '}
                or scale image width and height using{' '}
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('resize');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Resize Image
                </a>.
              </p>
            )}
            {(activeTab === 'rotate' && !isCroppingActive) && (
              <p>
                After rotating or flipping, cut to standard proportions using{' '}
                <a
                  href="/crop-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('crop');
                    setIsCroppingActive(true);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Crop Image
                </a>{' '}
                or scale dimensions with{' '}
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchTab('resize');
                    setIsCroppingActive(false);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Resize Image
                </a>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
