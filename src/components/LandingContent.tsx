import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Minimize2,
  Zap,
  Scissors,
  ArrowLeftRight,
  RefreshCw,
  Eraser,
  Lock,
  Smartphone,
} from 'lucide-react';
import { EditorTab } from '../types';
import { RouteSeoInfo } from '../utils/seo';

interface LandingContentProps {
  isHomePage: boolean;
  seo: RouteSeoInfo;
  onNavigate: (path: string) => void;
}

export const LandingContent: React.FC<LandingContentProps> = ({
  isHomePage,
  seo,
  onNavigate,
}) => {
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
     case 'background-remover':
  return <Eraser className="w-5 h-5" />;
        case 'rotate':
        return <RefreshCw className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <>
      {/* DEDICATED TOOL PAGE SECTIONS */}
      {!isHomePage && (
        <div className="w-full mt-10 space-y-10">
          {/* How-To Step-by-Step Guide */}
          <section
            aria-labelledby="heading-how-to"
            className="w-full bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs"
          >
            <h2
              id="heading-how-to"
              className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight mb-4"
            >
              How to {seo.breadcrumb} Online
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-extrabold">
                    1
                  </span>
                  <span>Select or Drag Your Image</span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                  Upload a JPG, PNG, or WEBP file from your device, or test immediately using one of our demo sample photos.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-extrabold">
                    2
                  </span>
                  <span>Configure {seo.breadcrumb} Options</span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                  Adjust settings with immediate live canvas preview and instant before-and-after resolution tracking.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-extrabold">
                    3
                  </span>
                  <span>Download Processed Image</span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                  Save your processed picture instantly without any watermarks, sign-up forms, or server delays.
                </p>
              </div>
            </div>
          </section>

          {/* Key Tool Features */}
          <section
            aria-labelledby="heading-features"
            className="w-full bg-neutral-100/70 border border-neutral-200/80 rounded-2xl p-6 sm:p-8"
          >
            <h2
              id="heading-features"
              className="text-lg sm:text-xl font-extrabold text-neutral-900 mb-3"
            >
              Key Features of {seo.breadcrumb}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
              {seo.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Related Tools Internal Linking */}
          <section
            aria-labelledby="heading-related-tools"
            className="w-full bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs"
          >
            <div className="mb-5">
              <h2
                id="heading-related-tools"
                className="text-xl font-extrabold text-neutral-900 tracking-tight"
              >
                Related Image Tools
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Combine with our other free browser tools for complete photo optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seo.relatedTools.map((tool) => (
                <a
                  key={tool.path}
                  href={tool.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(tool.path);
                  }}
                  className="group block p-4 rounded-xl border border-neutral-200 hover:border-blue-500 hover:shadow-xs transition-all bg-neutral-50/50 hover:bg-blue-50/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getToolIcon(tool.toolTab)}
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Use {tool.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Tool-Specific FAQ */}
          <section aria-labelledby="heading-tool-faq" className="w-full">
            <h2
              id="heading-tool-faq"
              className="text-xl font-extrabold text-neutral-900 tracking-tight mb-4"
            >
              Frequently Asked Questions About {seo.breadcrumb}
            </h2>
            <div className="space-y-3">
              {seo.faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-xl p-4 bg-white shadow-2xs"
                >
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">{faq.q}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* HOMEPAGE SPECIFIC SECTIONS */}
      {isHomePage && (
        <>
          {/* Tool Cards for All 5 Tools */}
          <section id="tools" className="w-full mt-12" aria-labelledby="heading-all-tools">
            <div className="text-center mb-6">
              <h2
                id="heading-all-tools"
                className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight"
              >
                Explore All Image Tools
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Select a tool below or upload your picture to start editing immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Resize Image */}
              <a
                href="/resize-image"
                id="tool-card-resize"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/resize-image');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Minimize2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Resize Image
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Change width and height in pixels, lock aspect ratios, and choose standard presets
                    like 1080×1080 or 1920×1080 with side-by-side before and after size previews.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Resize Tool</span>
                  <span>→</span>
                </div>
              </a>

              {/* Card 2: Compress Image */}
              <a
                href="/compress-image"
                id="tool-card-compress"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/compress-image');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Compress Image
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Reduce image file size with an adjustable quality slider (10% - 100%). View original
                    file size, compressed size, and exact reduction percentage.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Compress Tool</span>
                  <span>→</span>
                </div>
              </a>

              {/* Card 3: Crop Image */}
              <a
                href="/crop-image"
                id="tool-card-crop"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/crop-image');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Crop Image
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Crop precisely with interactive handles. Supports Free crop and standard aspect
                    ratios: 1:1, 4:5, 16:9, 9:16, and 3:2.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Crop Tool</span>
                  <span>→</span>
                </div>
              </a>

              {/* Card 4: Convert Image */}
              <a
                href="/convert-image"
                id="tool-card-convert"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/convert-image');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Convert Image
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Convert between JPG, JPEG, PNG, and WEBP formats. Includes transparency
                    preservation and customizable background colors for JPGs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Convert Tool</span>
                  <span>→</span>
                </div>
              </a>

              {/* Card 5: Rotate & Flip */}
              <a
                href="/rotate-flip-image"
                id="tool-card-rotate"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/rotate-flip-image');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none sm:col-span-2 lg:col-span-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Rotate & Flip Image
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Rotate 90 degrees clockwise or counter-clockwise. Mirror images horizontally or
                    flip them vertically with live real-time orientation preview.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Rotate & Flip Image</span>
                  <span>→</span>
                </div>
              </a>
              {/* Card 6: Remove Background */}
              <a
                href="/background-remover"
                id="tool-card-background-remover"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/background-remover');
                }}
                className="group bg-white p-5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Eraser className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    Remove Background
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Remove image backgrounds automatically and create transparent PNG images
                    directly in your browser.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Open Background Remover</span>
                  <span>→</span>
                </div>
              </a>
            </div>
          </section>

          {/* Why Quick Image Tools */}
          <section
            id="features"
            className="w-full mt-12 bg-neutral-100/70 border border-neutral-200/80 rounded-3xl p-6 sm:p-10"
            aria-labelledby="heading-why-quick"
          >
            <div className="text-center mb-8">
              <h2 id="heading-why-quick" className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Why Use Quick Image Tools?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Engineered for speed, privacy, and maximum device compatibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">100% Private & Secure</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Unlike other services, your photos are never uploaded to any remote web server. Everything is calculated in browser memory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Mobile-First Design</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Optimized for phones, tablets, and desktops alike. Direct camera roll upload, large touch targets, and zero horizontal scrolling.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">No Signup or Watermarks</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    No credit cards, accounts, or software installation needed. Export crystal-clear images without any watermarks.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Homepage FAQ */}
          <section id="faq" className="w-full mt-12 max-w-3xl" aria-labelledby="heading-home-faq">
            <div className="text-center mb-6">
              <h2
                id="heading-home-faq"
                className="text-2xl font-extrabold text-neutral-900 tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {seo.faqItems.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-neutral-200 rounded-2xl p-4 bg-white shadow-2xs"
                >
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">{faq.q}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};
