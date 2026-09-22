import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Minimize2,
  Scissors,
  ArrowLeftRight,
  RefreshCw,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { EditorTab, InfoModalType } from '../types';
import { getSeoForPath } from '../utils/seo';
import { LandingContent } from './LandingContent';

interface UploadScreenProps {
  currentPath: string;
  onFileSelected: (file: File) => void;
  onNavigate: (path: string) => void;
  onSelectFeature: (feature: EditorTab) => void;
  onOpenModal: (modal: InfoModalType) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  currentPath,
  onFileSelected,
  onNavigate,
  onSelectFeature,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);

  const seo = getSeoForPath(currentPath);
  const isHomePage = seo.path === '/';

  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
    const isExtValid = /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isMimeValid && !isExtValid) {
      setErrorMessage(
        'Unsupported file format. Please select a valid JPG, JPEG, PNG, or WEBP image.'
      );
      return;
    }

    // Validate size (25 MB max recommended)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        'File size exceeds the recommended 25 MB limit. Please pick an image under 25 MB.'
      );
      return;
    }

    // If on a dedicated tool page, set the corresponding active feature
    if (seo.toolTab) {
      onSelectFeature(seo.toolTab);
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleSampleClick = async (type: 'landscape' | 'portrait' | 'transparent') => {
    try {
      setIsGeneratingSample(true);
      setErrorMessage(null);
      if (seo.toolTab) {
        onSelectFeature(seo.toolTab);
      }
      const { createSampleImage } = await import('../utils/sampleImages');
      const sample = await createSampleImage(type);
      onFileSelected(sample);
    } catch {
      setErrorMessage('Failed to generate sample image. Please pick a file from your device.');
    } finally {
      setIsGeneratingSample(false);
    }
  };

  // Get icon for tool
  const getToolIcon = (tab: EditorTab) => {
    switch (tab) {
      case 'resize':
        return <Minimize2 className="w-5 h-5 text-blue-600" />;
      case 'compress':
        return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'crop':
        return <Scissors className="w-5 h-5 text-amber-600" />;
      case 'output':
        return <ArrowLeftRight className="w-5 h-5 text-purple-600" />;
      case 'rotate':
        return <RefreshCw className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Breadcrumb for dedicated tool pages */}
      {!isHomePage && (
        <nav
          aria-label="Breadcrumb"
          className="w-full max-w-2xl mb-4 text-xs text-neutral-500 flex items-center gap-1.5"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-semibold">{seo.breadcrumb}</span>
        </nav>
      )}

      {/* 1. HERO SECTION: Single H1 & Useful Description */}
      <section id="hero" className="flex flex-col items-center text-center mb-6 max-w-2xl">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3.5">
          {seo.toolTab ? getToolIcon(seo.toolTab) : <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8" />}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight mb-2.5">
          {seo.h1}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
          {seo.tagline}
        </p>
      </section>

      {/* Error Message Toast */}
      {errorMessage && (
        <div
          id="upload-error-message"
          className="w-full max-w-xl mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-left animate-in fade-in"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">Upload Issue</h3>
            <p className="text-sm text-red-700 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 text-sm font-bold ml-2 cursor-pointer"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. LARGE DRAG AND DROP UPLOAD AREA */}
      <div
        id="dropzone-upload-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-2xl rounded-2xl border-2 border-dashed transition-all cursor-pointer p-8 sm:p-12 flex flex-col items-center justify-center bg-white shadow-xs select-none ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-neutral-300 hover:border-blue-400 hover:bg-neutral-50/60'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label={`Upload image area for ${seo.breadcrumb}: drag and drop your photo or tap to select from files`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="image-file-input"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Upload className="w-8 h-8" />
        </div>

        <button
          type="button"
          id="btn-upload-image"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-base shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer mb-3 min-h-[48px]"
        >
          <Upload className="w-5 h-5" />
          <span>{isHomePage ? 'Upload Image' : `Upload Image to ${seo.breadcrumb}`}</span>
        </button>

        <p className="text-sm font-semibold text-neutral-700 mb-1 text-center">
          or drag and drop your image here
        </p>

        <p className="text-xs text-neutral-500 mb-4 text-center">
          Supports JPG, JPEG, PNG, WEBP • Max 25 MB recommended
        </p>

        {/* Accepted Formats & Size Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
          <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-semibold text-neutral-700">
            JPG
          </span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-semibold text-neutral-700">
            JPEG
          </span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-semibold text-neutral-700">
            PNG
          </span>
          <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-semibold text-neutral-700">
            WEBP
          </span>
        </div>
      </div>

      {/* Instant Demo / Sample Image selector */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
        <span className="flex items-center gap-1 font-medium text-neutral-600">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Try with demo photos:
        </span>
        <button
          type="button"
          disabled={isGeneratingSample}
          onClick={() => handleSampleClick('landscape')}
          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium transition-colors cursor-pointer min-h-[32px]"
        >
          1920×1080 Landscape (JPG)
        </button>
        <button
          type="button"
          disabled={isGeneratingSample}
          onClick={() => handleSampleClick('transparent')}
          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium transition-colors cursor-pointer min-h-[32px]"
        >
          Transparent Badge (PNG)
        </button>
        <button
          type="button"
          disabled={isGeneratingSample}
          onClick={() => handleSampleClick('portrait')}
          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium transition-colors cursor-pointer min-h-[32px]"
        >
          Portrait Photo (JPG)
        </button>
      </div>

      {/* Privacy Guarantee Message */}
      <div className="mt-5 flex items-center gap-2 text-xs text-neutral-600 bg-emerald-50/70 border border-emerald-200/60 px-4 py-2.5 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Zero Server Uploads:</strong> Your images are processed directly in your browser
          and never leave your device.
        </span>
      </div>

      {/* Below-the-fold landing sections */}
      <LandingContent
        isHomePage={isHomePage}
        seo={seo}
        onNavigate={onNavigate}
      />
    </div>
  );
};
