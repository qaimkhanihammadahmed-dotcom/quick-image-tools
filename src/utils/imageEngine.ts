import { SupportedFormat, TransformConfig, CropRect } from '../types';
import UPNG from 'upng-js';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getMimeType(format: SupportedFormat): string {
  switch (format) {
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

export function sanitizeFileName(name: string): string {
  // Strip any trailing extensions like .jpg, .png, .webp, .jpeg (case-insensitive)
  return name.replace(/\.(jpe?g|png|webp)$/i, '').trim();
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image. The file may be corrupt or invalid.'));
    img.src = src;
  });
}

export interface RenderCanvasOptions {
  img: HTMLImageElement;
  crop?: CropRect | null;
  transform: TransformConfig;
  targetWidth: number;
  targetHeight: number;
  format: SupportedFormat;
  quality: number; // 10 to 100
  backgroundColor: string; // for JPG
}

/**
 * Creates an in-memory canvas and applies transforms, crop, and resize,
 * returning the canvas and the 2D context.
 */
export function renderImageToCanvas(options: RenderCanvasOptions): HTMLCanvasElement {
  const {
    img,
    crop,
    transform,
    targetWidth,
    targetHeight,
    format,
    backgroundColor,
  } = options;

  // 1. First stage: Crop and Source extraction
  // Calculate source crop coordinates in original image pixel space
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let sx = 0;
  let sy = 0;
  let sw = origW;
  let sh = origH;

  if (crop) {
    sx = Math.max(0, Math.round((crop.x / 100) * origW));
    sy = Math.max(0, Math.round((crop.y / 100) * origH));
    sw = Math.min(origW - sx, Math.round((crop.width / 100) * origW));
    sh = Math.min(origH - sy, Math.round((crop.height / 100) * origH));
  }

  // Intermediate canvas for cropped and transformed source
  const interCanvas = document.createElement('canvas');
  const isRotated90or270 = transform.rotation === 90 || transform.rotation === 270;
  
  interCanvas.width = isRotated90or270 ? sh : sw;
  interCanvas.height = isRotated90or270 ? sw : sh;

  const interCtx = interCanvas.getContext('2d');
  if (!interCtx) {
    throw new Error('Canvas 2D context could not be initialized in your browser.');
  }

  interCtx.save();
  // Translate to center of interCanvas
  interCtx.translate(interCanvas.width / 2, interCanvas.height / 2);
  // Apply rotation
  interCtx.rotate((transform.rotation * Math.PI) / 180);
  // Apply flips
  const scaleX = transform.flipH ? -1 : 1;
  const scaleY = transform.flipV ? -1 : 1;
  interCtx.scale(scaleX, scaleY);

  // Draw source image cropped chunk centered
  interCtx.drawImage(
    img,
    sx,
    sy,
    sw,
    sh,
    -sw / 2,
    -sh / 2,
    sw,
    sh
  );
  interCtx.restore();

  // 2. Final stage: Resize and Output background
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = Math.max(1, Math.round(targetWidth));
  finalCanvas.height = Math.max(1, Math.round(targetHeight));

  const finalCtx = finalCanvas.getContext('2d');
  if (!finalCtx) {
    throw new Error('Final canvas could not be created.');
  }

  // Enable high quality smooth interpolation
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';

  // If format is JPG (or user provided background color), fill canvas background
  if (format === 'jpg') {
    finalCtx.fillStyle = backgroundColor || '#ffffff';
    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  }

  // Draw resized image
  finalCtx.drawImage(
    interCanvas,
    0,
    0,
    interCanvas.width,
    interCanvas.height,
    0,
    0,
    finalCanvas.width,
    finalCanvas.height
  );

  return finalCanvas;
}

/**
 * Exports canvas to Blob.
 * 1. For PNG: automatically compress the PNG into 8-bit (256 colors) using UPNG.encode([rgbaArray], width, height, 256)
 *    to drastically reduce size (e.g., from ~14MB down to ~1.5MB - 2MB) with no visible quality loss for logos, icons, and text images.
 * 2. For JPG and WEBP: use quality slider from 0 to 100 with default 80% (0.8) passed directly into canvas.toBlob.
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: SupportedFormat,
  quality: number
): Promise<Blob> {
  if (format === 'png') {
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const rgbaBuffer = imgData.data.buffer.slice(
          imgData.data.byteOffset,
          imgData.data.byteOffset + imgData.data.byteLength
        );
        // 8-bit PNG (256 colors) quantization & DEFLATE compression via UPNG
        const pngArrayBuffer = UPNG.encode([rgbaBuffer], canvas.width, canvas.height, 256);
        return new Blob([pngArrayBuffer], { type: 'image/png' });
      }
    } catch (err) {
      console.warn('UPNG 8-bit compression failed, falling back to standard PNG:', err);
    }
  }

  return new Promise((resolve, reject) => {
    const mime = getMimeType(format);
    // For JPG and WEBP: quality is 0 to 100, mapped to 0.0 to 1.0 (e.g., 80% -> 0.8)
    const q =
      format === 'png'
        ? undefined
        : quality <= 0
        ? 0.0
        : Math.min(1.0, quality / 100);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to encode image to blob.'));
        }
      },
      mime,
      q
    );
  });
}

/**
 * Fast estimation of output file size
 */
export async function estimateOutputSize(options: RenderCanvasOptions): Promise<number> {
  try {
    const canvas = renderImageToCanvas(options);
    // For very large canvases in PNG mode during slider interaction, optimize estimation
    if (options.format === 'png' && canvas.width * canvas.height > 1000 * 1000) {
      const maxDim = 800;
      const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
      const estCanvas = document.createElement('canvas');
      estCanvas.width = Math.max(1, Math.round(canvas.width * scale));
      estCanvas.height = Math.max(1, Math.round(canvas.height * scale));
      const estCtx = estCanvas.getContext('2d');
      if (estCtx) {
        estCtx.drawImage(canvas, 0, 0, estCanvas.width, estCanvas.height);
        const estBlob = await canvasToBlob(estCanvas, options.format, options.quality);
        const areaRatio = (canvas.width * canvas.height) / (estCanvas.width * estCanvas.height);
        return Math.round(estBlob.size * Math.pow(areaRatio, 0.88));
      }
    }
    const blob = await canvasToBlob(canvas, options.format, options.quality);
    return blob.size;
  } catch (err) {
    console.warn('Size estimation failed:', err);
    return 0;
  }
}

/**
 * Triggers a browser download of a blob
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
