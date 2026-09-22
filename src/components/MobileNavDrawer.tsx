import React, { useEffect } from 'react';
import {
  X,
  Home,
  Minimize2,
  Image as ImageIcon,
  Scissors,
  ArrowLeftRight,
  RefreshCw,
  Eraser,
  LayoutGrid,
  Info,
  HelpCircle,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { InfoModalType } from '../types';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onNavigate: (path: string) => void;
  onOpenModal: (modal: InfoModalType) => void;
  onScrollToAllTools?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onGoHome,
  onNavigate,
  onOpenModal,
  onScrollToAllTools,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Drawer Panel */}
      <div
        className="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header inside Drawer */}
        <div>
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/70">
            <span className="font-extrabold text-neutral-900 text-lg tracking-tight">
              Quick Image Tools
            </span>

            <button
              type="button"
              id="btn-close-mobile-menu"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="p-3 space-y-1"
            aria-label="Mobile Drawer Navigation"
          >
            {/* 1. Home */}
            <a
              href="/"
              id="mobile-nav-home"
              onClick={(e) => {
                e.preventDefault();
                onGoHome();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Home className="w-4 h-4 text-blue-600" />
              <span>Home</span>
            </a>

            {/* Image Tools Category */}
            <div className="pt-2 pb-1 px-3.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Image Tools
            </div>

            {/* 2. Resize Image */}
            <a
              href="/resize-image"
              id="mobile-nav-resize"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/resize-image');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Minimize2 className="w-4 h-4 text-blue-600" />
              <span>Resize Image</span>
            </a>

            {/* 3. Compress Image */}
            <a
              href="/compress-image"
              id="mobile-nav-compress"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/compress-image');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Compress Image</span>
            </a>

            {/* 4. Crop Image */}
            <a
              href="/crop-image"
              id="mobile-nav-crop"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/crop-image');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Scissors className="w-4 h-4 text-blue-600" />
              <span>Crop Image</span>
            </a>

            {/* 5. Convert Image */}
            <a
              href="/convert-image"
              id="mobile-nav-convert"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/convert-image');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Convert Image</span>
            </a>

            {/* 6. Rotate & Flip */}
            <a
              href="/rotate-flip-image"
              id="mobile-nav-rotate"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/rotate-flip-image');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>Rotate & Flip Image</span>
            </a>

            {/* 7. Remove Background */}
            <a
              href="/background-remover"
              id="mobile-nav-background-remover"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/background-remover');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Eraser className="w-4 h-4 text-blue-600" />
              <span>Remove Background</span>
            </a>

            {/* 8. All Image Tools */}
            <a
              href="/#tools"
              id="mobile-nav-all-tools"
              onClick={(e) => {
                e.preventDefault();

                if (onScrollToAllTools) {
                  onScrollToAllTools();
                } else {
                  onGoHome();
                }

                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span>All Image Tools</span>
            </a>

            {/* Information Category */}
            <div className="pt-2 pb-1 px-3.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Information
            </div>

            {/* 9. About */}
            <button
              type="button"
              id="mobile-nav-about"
              onClick={() => {
                onOpenModal('about');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Info className="w-4 h-4 text-neutral-500" />
              <span>About</span>
            </button>

            {/* 10. FAQ */}
            <button
              type="button"
              id="mobile-nav-faq"
              onClick={() => {
                onOpenModal('faq');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <HelpCircle className="w-4 h-4 text-neutral-500" />
              <span>FAQ</span>
            </button>

            {/* 11. Contact */}
            <button
              type="button"
              id="mobile-nav-contact"
              onClick={() => {
                onOpenModal('contact');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>Contact</span>
            </button>
          </nav>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% In-Browser & Private</span>
          </div>

          <p className="text-[11px] text-neutral-500">
            Images never leave your device.
          </p>
        </div>
      </div>
    </div>
  );
};