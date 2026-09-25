import React, { useEffect, useRef, useState } from 'react';
import { removeBackground } from '@imgly/background-removal';

export default function BackgroundRemoverPanel({
  imageMeta,
  onImageReady,
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(
    imageMeta?.file || null
  );

  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (imageMeta?.file) {
      setSelectedFile(imageMeta.file);
      setResultUrl(null);
      setProgress(0);
      setStatus('');
    }
  }, [imageMeta]);

  // Create preview for selected image
  useEffect(() => {
    if (!selectedFile) {
      setOriginalPreview(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setOriginalPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Select image
  const handleSelectImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('براہِ کرم صرف تصویر منتخب کریں۔');
      return;
    }

    setSelectedFile(file);
    setResultUrl(null);
    setProgress(0);
    setStatus('');

    // Allow selecting the same image again
    event.target.value = '';
  };

  // Open file selector
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Remove background
  const handleRemoveBackground = async () => {
    if (!selectedFile || processing) return;

    setProcessing(true);
    setProgress(0);
    setStatus('Background remove ہو رہا ہے...');

    try {
      const resultBlob = await removeBackground(selectedFile, {
        model: 'isnet_fp16',
        device: 'gpu',

        progress: (
          key: string,
          current: number,
          total: number
        ) => {
          if (total > 0) {
            const percent = Math.round(
              (current / total) * 100
            );

            setProgress(percent);
          }

          if (key) {
            setStatus('Background remove ہو رہا ہے...');
          }
        },
      } as any);

      // Create transparent PNG URL
      const transparentUrl = URL.createObjectURL(resultBlob);

      setResultUrl(transparentUrl);
      setProgress(100);
      setStatus('Background کامیابی سے remove ہو گیا۔');

      // Send result to parent if required
      if (onImageReady) {
        await onImageReady(resultBlob);
      }
    } catch (error: any) {
      console.error('Background removal failed:', error);

      setProgress(0);
      setStatus('');

      alert(
        error?.message ||
          'Background remove نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔'
      );
    } finally {
      setProcessing(false);
    }
  };

  // Download transparent PNG
  const handleDownload = () => {
    if (!resultUrl) return;

    const link = document.createElement('a');

    link.href = resultUrl;
    link.download = 'background-removed.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Select another image
  const handleAnotherImage = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setResultUrl(null);
    setSelectedFile(null);
    setOriginalPreview(null);
    setProgress(0);
    setStatus('');

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  return (
    <div className="w-full space-y-5">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSelectImage}
      />

      {/* STEP 1 - Select Image */}
      {!selectedFile && !resultUrl && (
        <button
          type="button"
          onClick={openFileSelector}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl font-bold transition"
        >
          Select Image
        </button>
      )}

      {/* STEP 2 - Selected Image Preview */}
      {selectedFile && !resultUrl && (
        <div className="w-full space-y-4">

          {/* Original image */}
          <div className="w-full border-2 border-gray-200 rounded-xl p-3 bg-gray-50">
            {originalPreview && (
              <img
                src={originalPreview}
                alt="Selected image"
                className="w-full max-h-[450px] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Remove Background Button */}
          {!processing && (
            <button
              type="button"
              onClick={handleRemoveBackground}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-5 rounded-xl font-bold text-lg transition shadow-md"
            >
              Remove Background
            </button>
          )}

          {/* Processing */}
          {processing && (
            <div className="w-full space-y-3">

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${Math.max(progress, 5)}%`,
                  }}
                />
              </div>

              <div className="text-center font-semibold text-gray-700">
                {status || 'Processing...'}
              </div>

              <div className="text-center text-sm text-gray-500">
                {progress}%
              </div>

            </div>
          )}

          {/* Change image */}
          {!processing && (
            <button
              type="button"
              onClick={openFileSelector}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Change Image
            </button>
          )}

        </div>
      )}

      {/* STEP 3 - Transparent Result */}
      {resultUrl && (
        <div className="w-full space-y-4">

          {/* Transparent checkerboard */}
          <div
            className="w-full border-2 border-gray-200 rounded-xl p-3 overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage: `
                linear-gradient(45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #d1d5db 75%),
                linear-gradient(-45deg, transparent 75%, #d1d5db 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition:
                '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          >
            <img
              src={resultUrl}
              alt="Background removed result"
              className="w-full max-h-[450px] object-contain rounded-lg"
            />
          </div>

          {/* Success message */}
          <div className="text-center text-green-600 font-bold">
            ✓ Background remove ہو گیا
          </div>

          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-5 rounded-xl font-bold text-lg transition shadow-md"
          >
            Download PNG
          </button>

          {/* Another Image */}
          <button
            type="button"
            onClick={handleAnotherImage}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
          >
            Add Another Image
          </button>

        </div>
      )}

    </div>
  );
}