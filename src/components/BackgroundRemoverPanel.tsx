import React, { useEffect, useRef, useState } from 'react';
import { removeBackground } from '@imgly/background-removal';

type Props = {
  imageMeta: any;
  onImageReady?: (result: Blob) => Promise<void> | void;
};

export default function BackgroundRemoverPanel({
  imageMeta,
  onImageReady,
}: Props) {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(
    imageMeta?.file || null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keep the selected file synced with the main editor
  useEffect(() => {
    if (imageMeta?.file) {
      setCurrentFile(imageMeta.file);
    } else {
      setCurrentFile(null);
    }
  }, [imageMeta?.file]);

  // Clean up generated result URL
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const handleRemove = async () => {
    if (!currentFile) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    setResultUrl(null);
    setStatus('Processing image...');

    try {
      const blob = await removeBackground(currentFile, {
        model: 'isnet_fp16',
        output: {
          format: 'image/png',
          quality: 1,
        },
        progress: () => {
          setStatus('Processing image...');
        },
      });

      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setStatus('Background removed successfully!');

      if (onImageReady) {
        await onImageReady(blob);
      }
    } catch (error: any) {
      setStatus('Background removal failed.');

      alert(
        `Background removal failed:\n${
          error?.message || 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Open the file picker for another image
  const handleAddAnotherImage = () => {
    if (loading) return;

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle newly selected image
  const handleNewImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setCurrentFile(file);
    setResultUrl(null);
    setStatus('');

    // Tell App.tsx that a new image was selected
    window.dispatchEvent(
      new CustomEvent('quick-image-tools:new-background-image', {
        detail: {
          file,
        },
      })
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleNewImage}
        className="hidden"
      />

      {/* Remove Background button */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={loading || !currentFile}
        className="relative w-full overflow-hidden bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-5 rounded-lg transition-colors"
      >
        {/* Moving progress line */}
        {loading && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 bottom-0 left-0 w-1/3 bg-blue-800/70"
              style={{
                animation:
                  'backgroundRemovalProgress 1.4s linear infinite',
              }}
            />
          </div>
        )}

        <span className="relative z-10">
          {loading ? 'Processing...' : 'Remove Background'}
        </span>
      </button>

      {/* Progress animation */}
      <style>
        {`
          @keyframes backgroundRemovalProgress {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(420%);
            }
          }
        `}
      </style>

      {/* Processing status */}
      {status && !resultUrl && (
        <p className="text-sm text-neutral-500 text-center">
          {status}
        </p>
      )}

      {/* Result */}
      {resultUrl && (
        <div className="space-y-3">
          <p className="text-green-600 font-bold text-sm">
            Background removed successfully!
          </p>

          {/* Transparent PNG preview */}
          <div
            className="w-full border-2 border-neutral-200 rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[300px]"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage:
                'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition:
                '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <img
              src={resultUrl}
              alt="Background removed"
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>

          {/* Download */}
          <a
            href={resultUrl}
            download="transparent-background.png"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Download Transparent PNG
          </a>

          {/* Add another image */}
          <button
            type="button"
            onClick={handleAddAnotherImage}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Add Another Image
          </button>

          <p className="text-xs text-neutral-500 text-center">
            PNG format keeps the removed background transparent.
          </p>
        </div>
      )}
    </div>
  );
}