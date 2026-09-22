import React, { useState } from 'react';
import {
  ChevronDown,
  Minimize2,
  Image as ImageIcon,
  Scissors,
  ArrowLeftRight,
  RefreshCw,
  ShieldCheck,
  Eraser,
} from 'lucide-react';
import { EditorTab, InfoModalType } from '../types';

interface HeaderProps {
  hasImage: boolean;
  activeTab?: EditorTab;
  isOutputPreview?: boolean;
  onGoHome: () => void;
  onGoBack?: () => void;
  onNavigate: (path: string) => void;
  onStartOver?: () => void;
  onOpenMobileMenu: () => void;
  onOpenModal: (modal: InfoModalType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasImage,
  onGoHome,
  onNavigate,
  onStartOver,
  onOpenMobileMenu,
  onOpenModal,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">

        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">

          {/* Mobile Hamburger */}
          <button
            type="button"
            id="mobile-hamburger-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 active:bg-blue-100 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer shrink-0 -ml-1 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            aria-label="Open Navigation Menu"
            title="Open navigation menu"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3.5" y1="6" x2="20.5" y2="6" />
              <line x1="3.5" y1="12" x2="20.5" y2="12" />
              <line x1="3.5" y1="18" x2="20.5" y2="18" />
            </svg>
          </button>

          {/* Logo / Home */}
          <a
            href="/"
            id="brand-home-link"
            onClick={(e) => {
              e.preventDefault();
              onGoHome();
            }}
            className="flex flex-col text-left group cursor-pointer focus:outline-hidden py-1 min-w-0"
            aria-label="Quick Image Tools Home"
          >
            <span className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors truncate">
              Quick Image Tools
            </span>

            <span className="text-[11px] text-neutral-500 hidden sm:block truncate">
              Free Browser Image Resizer & Editor
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 sm:gap-2"
          aria-label="Main Navigation"
        >

          {/* Home */}
          <a
            href="/"
            id="desktop-nav-home"
            onClick={(e) => {
              e.preventDefault();
              onGoHome();
            }}
            className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Home
          </a>

          {/* Image Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="desktop-nav-tools-dropdown"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => {
                setTimeout(() => {
                  setToolsDropdownOpen(false);
                }, 200);
              }}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-expanded={toolsDropdownOpen}
            >
              <span>Image Tools</span>
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95">

                {/* Resize Image */}
                <a
                  href="/resize-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/resize-image');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4 text-blue-600" />
                  <span>Resize Image</span>
                </a>

                {/* Compress Image */}
                <a
                  href="/compress-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/compress-image');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Compress Image</span>
                </a>

                {/* Crop Image */}
                <a
                  href="/crop-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/crop-image');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <Scissors className="w-4 h-4 text-blue-600" />
                  <span>Crop Image</span>
                </a>

                {/* Convert Image */}
                <a
                  href="/convert-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/convert-image');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                  <span>Convert Image</span>
                </a>

                {/* Rotate & Flip Image */}
                <a
                  href="/rotate-flip-image"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/rotate-flip-image');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>Rotate & Flip Image</span>
                </a>

                {/* Remove Background */}
                <a
                  href="/background-remover"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/background-remover');
                    setToolsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer"
                >
                  <Eraser className="w-4 h-4 text-blue-600" />
                  <span>Remove Background</span>
                </a>

              </div>
            )}
          </div>

          {/* About */}
          <button
            type="button"
            id="desktop-nav-about"
            onClick={() => onOpenModal('about')}
            className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            About
          </button>

          {/* FAQ */}
          <button
            type="button"
            id="desktop-nav-faq"
            onClick={() => onOpenModal('faq')}
            className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            FAQ
          </button>

          {/* Contact */}
          <button
            type="button"
            id="desktop-nav-contact"
            onClick={() => onOpenModal('contact')}
            className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Contact
          </button>

        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Privacy */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">100% In-Browser</span>
          </div>

          {/* Reset */}
          {hasImage && onStartOver && (
            <button
              type="button"
              id="header-btn-start-over"
              onClick={onStartOver}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors cursor-pointer min-h-[36px]"
              title="Reset and choose another image"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};