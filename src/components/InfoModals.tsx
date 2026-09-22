import React, { useState } from 'react';
import { X, ShieldCheck, Mail, HelpCircle, Info, FileText, CheckCircle2 } from 'lucide-react';
import { InfoModalType } from '../types';

interface InfoModalsProps {
  modalType: InfoModalType;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({ modalType, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!modalType) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            {modalType === 'about' && <Info className="w-5 h-5 text-blue-600" />}
            {modalType === 'faq' && <HelpCircle className="w-5 h-5 text-blue-600" />}
            {modalType === 'contact' && <Mail className="w-5 h-5 text-blue-600" />}
            {modalType === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            {modalType === 'terms' && <FileText className="w-5 h-5 text-neutral-600" />}
            <h3 className="text-base font-bold text-neutral-900 capitalize">
              {modalType === 'faq'
                ? 'Frequently Asked Questions'
                : modalType === 'privacy'
                ? 'Privacy Policy'
                : modalType === 'terms'
                ? 'Terms of Use'
                : modalType}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-neutral-600 leading-relaxed">
          {modalType === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-blue-950">
                <h4 className="font-bold text-sm mb-1 text-blue-900">About Quick Image Tools</h4>
                <p className="text-xs sm:text-sm text-blue-800">
                  Quick Image Tools is a lightning-fast, privacy-first image editing platform that
                  runs entirely in your web browser. No account, no subscription, and no file uploads
                  to remote servers required.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 mb-1">Our Mission</h5>
                <p>
                  Most online image resizers upload your sensitive photos, IDs, or family pictures to
                  external cloud servers. Quick Image Tools does everything locally using modern HTML5
                  Canvas and WebAssembly technologies, ensuring your media never leaves your phone,
                  tablet, or computer.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-900 mb-1">Key Capabilities</h5>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li><strong>Image Resizing:</strong> Custom dimensions, social media presets, and aspect ratio locking.</li>
                  <li><strong>Smart Compression:</strong> Reduce file sizes by up to 90% with adjustable quality control.</li>
                  <li><strong>Accurate Cropping:</strong> Freeform and preset aspect ratios (1:1, 4:5, 16:9, 9:16, 3:2).</li>
                  <li><strong>Format Conversion:</strong> Convert smoothly between JPG, PNG, and WEBP.</li>
                  <li><strong>Orientation:</strong> Rotate 90° clockwise/counter-clockwise and flip horizontally or vertically.</li>
                </ul>
              </div>
            </div>
          )}

          {modalType === 'faq' && (
            <div className="space-y-3">
              <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                <h5 className="font-bold text-neutral-900 text-sm mb-1">
                  Are my images uploaded to any server?
                </h5>
                <p className="text-xs text-neutral-600">
                  No. All image resizing, cropping, compression, and conversion happens strictly on your
                  device inside your browser memory. Your images are never sent across the internet.
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                <h5 className="font-bold text-neutral-900 text-sm mb-1">
                  What image formats are supported?
                </h5>
                <p className="text-xs text-neutral-600">
                  You can upload JPG, JPEG, PNG, and WEBP images. You can convert your processed results
                  into JPG, PNG, or WEBP formats at any time before downloading.
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                <h5 className="font-bold text-neutral-900 text-sm mb-1">
                  What is the maximum file size limit?
                </h5>
                <p className="text-xs text-neutral-600">
                  We recommend images up to 25 MB for optimal browser memory performance and smooth
                  real-time rendering on both mobile phones and desktop computers.
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                <h5 className="font-bold text-neutral-900 text-sm mb-1">
                  How does the side-by-side resize display work?
                </h5>
                <p className="text-xs text-neutral-600">
                  When you adjust target dimensions in the Resize Image tool, our real-time engine
                  calculates the exact new pixel dimensions and projected output file size against the
                  original file so you know the exact result before downloading.
                </p>
              </div>

              <div className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50/50">
                <h5 className="font-bold text-neutral-900 text-sm mb-1">
                  Can I use this tool on my iPhone or Android?
                </h5>
                <p className="text-xs text-neutral-600">
                  Yes! Quick Image Tools is engineered mobile-first with high-contrast, touch-friendly
                  controls, direct camera roll / gallery selection, and responsive layout scaling.
                </p>
              </div>
            </div>
          )}

          {modalType === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="p-6 text-center flex flex-col items-center justify-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                  <h4 className="text-base font-bold text-neutral-900">Message Received!</h4>
                  <p className="text-xs text-neutral-500">
                    Thank you for reaching out. We appreciate your feedback on Quick Image Tools.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <p className="text-xs text-neutral-500">
                    Have a question, feature request, or suggestion? Send us a quick note below:
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Message / Feedback
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe what tool you need or your suggestion..."
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          )}

          {modalType === 'privacy' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Client-Side Privacy:</strong> We do not store, view, or transmit your images to any remote servers.
                </span>
              </div>
              <h5 className="font-bold text-neutral-900">Zero File Storage</h5>
              <p>
                When you select or drop a photo into Quick Image Tools, the browser reads the file into
                local JavaScript memory using the File API. All image computations (resizing, cropping,
                compression, and format conversion) are executed on your device using the HTML5 Canvas API.
              </p>
              <h5 className="font-bold text-neutral-900">No Tracking or Personal Data</h5>
              <p>
                We do not require account registration, login credentials, or personal profiles. No tracking
                cookies are stored to monitor your files.
              </p>
            </div>
          )}

          {modalType === 'terms' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <h5 className="font-bold text-neutral-900">Terms of Use</h5>
              <p>
                Quick Image Tools is provided free of charge for personal, educational, and commercial
                purposes.
              </p>
              <h5 className="font-bold text-neutral-900">User Responsibility</h5>
              <p>
                Users are solely responsible for ensuring they have appropriate rights and permissions
                for the images they process and export using this software.
              </p>
              <h5 className="font-bold text-neutral-900">Service Availability</h5>
              <p>
                The service is provided on an &quot;as-is&quot; basis without warranties of any kind. As processing
                is executed locally in the browser, performance is dependent upon the host device hardware
                and available memory.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
