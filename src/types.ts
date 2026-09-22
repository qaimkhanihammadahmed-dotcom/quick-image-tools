export type SupportedFormat = 'jpg' | 'png' | 'webp';

export type AspectRatioPreset = 'free' | '1:1' | '4:5' | '16:9' | '9:16' | '3:2';

export interface ImageMeta {
  file: File;
  name: string; // Base name without extension
  extension: string; // original extension e.g. "jpg"
  mimeType: string;
  size: number; // bytes
  width: number;
  height: number;
  srcUrl: string; // Object URL
}

export interface CropRect {
  x: number; // Normalized 0..100 percentage
  y: number;
  width: number;
  height: number;
}

export interface ResizeConfig {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  preset: string; // 'custom' | '1080x1080' | ...
}

export interface TransformConfig {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
}

export interface OutputConfig {
  format: SupportedFormat;
  quality: number; // 10 to 100
  backgroundColor: string; // hex color for JPG
  fileName: string; // editable filename without extension
}

export interface ProcessedOutput {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: SupportedFormat;
  filename: string;
}

export type EditorTab =
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'compress'
  | 'output'
  | 'background-remover';

export type InfoModalType = 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | null;
