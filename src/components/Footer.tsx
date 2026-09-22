import React from 'react';
import { SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { InfoModalType } from '../types';

interface FooterProps {
  onGoHome: () => void;
  onNavigate: (path: string) => void;
  onOpenModal: (modal: InfoModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onNavigate,
  onOpenModal,
}) => {
  return (
    <footer
      className="w-full bg-white border-t border-neutral-200 mt-auto select-none"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Column 1: Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>

              <span className="font-extrabold text-neutral-900 text-lg tracking-tight">
                Quick Image Tools
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed">
              Fast, privacy-first online image resizer and basic image editor.
              Resize, crop, compress, and convert your photos directly inside
              your browser with 100% security and zero server uploads.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">
                Processed 100% locally on your device
              </span>
            </div>
          </div>

          {/* Column 2: Image Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Image Tools
            </h4>

            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">

              {/* Resize Image */}
              <li>
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/resize-image');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Resize Image
                </a>
              </li>

              {/* Compress Image */}
              <li>
                <a
                  href="/compress-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/compress-image');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Compress Image
                </a>
              </li>

              {/* Crop Image */}
              <li>
                <a
                  href="/crop-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/crop-image');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Crop Image
                </a>
              </li>

              {/* Convert Image */}
              <li>
                <a
                  href="/convert-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/convert-image');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Convert Image
                </a>
              </li>

              {/* Rotate & Flip Image */}
              <li>
                <a
                  href="/rotate-flip-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/rotate-flip-image');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Rotate & Flip Image
                </a>
              </li>

              {/* Remove Background */}
              <li>
                <a
                  href="/background-remover"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/background-remover');
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Remove Background
                </a>
              </li>

            </ul>
          </div>

          {/* Column 3: Company / Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Information & Legal
            </h4>

            <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">

              {/* Home */}
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onGoHome();
                  }}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Home
                </a>
              </li>

              {/* About */}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('about')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  About
                </button>
              </li>

              {/* FAQ */}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('faq')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  FAQ
                </button>
              </li>

              {/* Contact */}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Contact
                </button>
              </li>

              {/* Privacy Policy */}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Privacy Policy
                </button>
              </li>

              {/* Terms of Use */}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-blue-600 transition-colors text-left cursor-pointer inline-block"
                >
                  Terms of Use
                </button>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Quick Image Tools. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span>
              Built for speed, simplicity, and complete privacy.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};