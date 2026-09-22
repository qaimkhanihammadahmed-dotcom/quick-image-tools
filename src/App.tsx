import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { Footer } from './components/Footer';
import { ImageMeta, ProcessedOutput, EditorTab, InfoModalType } from './types';
import { getSeoForPath, getPathForTab, applySeoMetadata } from './utils/seo';

// Lazy-load non-critical components not needed for initial First Contentful Paint
const ImageEditor = lazy(() =>
  import('./components/ImageEditor').then((m) => ({ default: m.ImageEditor }))
);

const OutputPreview = lazy(() =>
  import('./components/OutputPreview').then((m) => ({ default: m.OutputPreview }))
);

const InfoModals = lazy(() =>
  import('./components/InfoModals').then((m) => ({ default: m.InfoModals }))
);

const ConfirmResetModal = lazy(() =>
  import('./components/ConfirmResetModal').then((m) => ({ default: m.ConfirmResetModal }))
);

const MobileNavDrawer = lazy(() =>
  import('./components/MobileNavDrawer').then((m) => ({ default: m.MobileNavDrawer }))
);

export default function App() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);

  const [activeTab, setActiveTab] = useState<EditorTab>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname || '/';
      return getSeoForPath(initialPath).toolTab || 'resize';
    }

    return 'resize';
  });

  const [processedOutput, setProcessedOutput] =
    useState<ProcessedOutput | null>(null);

  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);
  const [fileReadError, setFileReadError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<InfoModalType>(null);

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }

    return '/';
  });

  // Apply SEO metadata and sync route on mount and popstate
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname || '/';

      setCurrentPath(path);

      const seo = getSeoForPath(path);

      applySeoMetadata(seo);

      if (seo.toolTab) {
        setActiveTab(seo.toolTab);
      }
    };

    syncRouteFromLocation();

    window.addEventListener('popstate', syncRouteFromLocation);

    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);

  // Programmatic navigation handler that updates URL, state, and SEO metadata
  const navigateTo = useCallback(
    (path: string) => {
      const normalizedPath =
        path.toLowerCase().replace(/\/$/, '') || '/';

      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', normalizedPath);
      }

      setCurrentPath(normalizedPath);

      const seo = getSeoForPath(normalizedPath);

      applySeoMetadata(seo);

      if (seo.toolTab) {
        setActiveTab(seo.toolTab);

        if (processedOutput) {
          setProcessedOutput(null);
        }
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [processedOutput]
  );

  // Handle incoming file selection from upload or drag-and-drop
  const handleFileSelected = useCallback(async (file: File) => {
    setFileReadError(null);

    try {
      // Start fetching ImageEditor and imageEngine chunks only when user initiates editing
      const [_, { loadImage }] = await Promise.all([
        import('./components/ImageEditor'),
        import('./utils/imageEngine'),
      ]);

      const srcUrl = URL.createObjectURL(file);

      const img = await loadImage(srcUrl);

      // Parse filename and extension
      const lastDotIndex = file.name.lastIndexOf('.');

      const rawExt =
        lastDotIndex !== -1
          ? file.name.slice(lastDotIndex + 1).toLowerCase()
          : 'jpg';

      const baseName =
        lastDotIndex !== -1
          ? file.name.slice(0, lastDotIndex)
          : file.name;

      const meta: ImageMeta = {
        file,
        name: baseName || 'photo',
        extension: rawExt,
        mimeType: file.type || 'image/jpeg',
        size: file.size,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        srcUrl,
      };

      setImageMeta(meta);
      setProcessedOutput(null);
      setHasEdits(false);
    } catch (err: any) {
      setFileReadError(
        err.message ||
          'Could not decode this image file. Please try another image.'
      );
    }
  }, []);

  // Receive a new image from the Background Remover "Add Another Image" button
  useEffect(() => {
    const handleBackgroundRemoverNewImage = (event: Event) => {
      const customEvent =
        event as CustomEvent<{ file?: File }>;

      const file = customEvent.detail?.file;

      if (!file) return;

      handleFileSelected(file);
    };

    window.addEventListener(
      'quick-image-tools:new-background-image',
      handleBackgroundRemoverNewImage
    );

    return () => {
      window.removeEventListener(
        'quick-image-tools:new-background-image',
        handleBackgroundRemoverNewImage
      );
    };
  }, [handleFileSelected]);

  // Starting over flow with confirmation if user made edits
  const handleRequestStartOver = () => {
    if (hasEdits || processedOutput) {
      setIsConfirmResetOpen(true);
    } else {
      performReset();
    }
  };

  const performReset = () => {
    if (imageMeta?.srcUrl) {
      URL.revokeObjectURL(imageMeta.srcUrl);
    }

    if (processedOutput?.url) {
      URL.revokeObjectURL(processedOutput.url);
    }

    setImageMeta(null);
    setProcessedOutput(null);
    setHasEdits(false);
    setIsConfirmResetOpen(false);
  };

  // Home navigation handler
  const handleGoHome = () => {
    if (processedOutput) {
      setProcessedOutput(null);
    }

    if (imageMeta && hasEdits) {
      setIsConfirmResetOpen(true);
    } else if (imageMeta) {
      performReset();
    }

    navigateTo('/');
  };

  // Back navigation handler
  const handleGoBack = () => {
    if (processedOutput) {
      // In Output Preview -> Return to Editor
      setProcessedOutput(null);
    } else if (imageMeta) {
      // In Editor -> Ask or Return to Homepage
      if (hasEdits) {
        setIsConfirmResetOpen(true);
      } else {
        performReset();
        navigateTo('/');
      }
    }
  };

  // Called when output is produced from Editor
  const handleImageProcessed = (output: ProcessedOutput) => {
    setProcessedOutput(output);
    setHasEdits(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Called when Background Remover creates a transparent PNG
  const handleImageUpdated = useCallback(
    async (blob: Blob) => {
      if (!imageMeta) return;

      const srcUrl = URL.createObjectURL(blob);

      try {
        const dimensions = await new Promise<{
          width: number;
          height: number;
        }>((resolve, reject) => {
          const image = new Image();

          image.onload = () =>
            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });

          image.onerror = () =>
            reject(
              new Error('Could not read the processed image.')
            );

          image.src = srcUrl;
        });

        URL.revokeObjectURL(imageMeta.srcUrl);

        const file = new File(
          [blob],
          `${imageMeta.name}-no-background.png`,
          {
            type: 'image/png',
          }
        );

        setImageMeta({
          file,
          name: `${imageMeta.name}-no-background`,
          extension: 'png',
          mimeType: 'image/png',
          size: blob.size,
          width: dimensions.width,
          height: dimensions.height,
          srcUrl,
        });

        setHasEdits(true);
      } catch (error) {
        URL.revokeObjectURL(srcUrl);
        throw error;
      }
    },
    [imageMeta]
  );

  // Return from output preview to edit again
  const handleEditAgain = () => {
    setProcessedOutput(null);
  };

  // When tab is changed inside editor
  const handleTabChange = (tab: EditorTab) => {
    setActiveTab(tab);

    const targetPath = getPathForTab(tab);

    if (targetPath !== currentPath) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', targetPath);
      }

      setCurrentPath(targetPath);

      applySeoMetadata(getSeoForPath(targetPath));
    }
  };

  // Select tool from navigation or footer
  const handleSelectTool = (tool: EditorTab) => {
    const targetPath = getPathForTab(tool);

    navigateTo(targetPath);

    setActiveTab(tool);

    if (processedOutput) {
      setProcessedOutput(null);
    }
  };

  // Scroll to tools section on homepage
  const handleScrollToAllTools = () => {
    if (!imageMeta && currentPath === '/') {
      const toolsElem = document.getElementById('tools');

      if (toolsElem) {
        toolsElem.scrollIntoView({
          behavior: 'smooth',
        });

        return;
      }
    }

    navigateTo('/');

    setTimeout(() => {
      const toolsElem = document.getElementById('tools');

      toolsElem?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden text-sm font-semibold"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        hasImage={!!imageMeta}
        activeTab={activeTab}
        isOutputPreview={!!processedOutput}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
        onNavigate={navigateTo}
        onStartOver={handleRequestStartOver}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-start w-full"
      >
        {fileReadError && (
          <div className="w-full max-w-2xl mt-4 px-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center justify-between">
              <span>{fileReadError}</span>

              <button
                type="button"
                onClick={() => setFileReadError(null)}
                className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* View 1: No image loaded -> Clean Homepage or Dedicated Tool Landing Page */}
        {!imageMeta && (
          <UploadScreen
            currentPath={currentPath}
            onFileSelected={handleFileSelected}
            onNavigate={navigateTo}
            onSelectFeature={(feature) => {
              setActiveTab(feature);
            }}
            onOpenModal={(modal) => setActiveModal(modal)}
          />
        )}

        {/* View 2: Image loaded & Output is ready -> Output Preview */}
        {imageMeta && processedOutput && (
          <Suspense
            fallback={
              <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[350px]">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                <span className="text-xs text-neutral-500 font-medium mt-3">
                  Preparing preview...
                </span>
              </div>
            }
          >
            <OutputPreview
              originalMeta={imageMeta}
              processed={processedOutput}
              onEditAgain={handleEditAgain}
              onStartOver={handleRequestStartOver}
              onGoHome={handleGoHome}
            />
          </Suspense>
        )}

        {/* View 3: Image loaded & In Editor */}
        {imageMeta && !processedOutput && (
          <Suspense
            fallback={
              <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[350px]">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                <span className="text-xs text-neutral-500 font-medium mt-3">
                  Loading editor...
                </span>
              </div>
            }
          >
            <ImageEditor
              meta={imageMeta}
              initialTab={activeTab}
              onProcessed={handleImageProcessed}
              onStartOver={handleRequestStartOver}
              onGoHome={handleGoHome}
              onGoBack={handleGoBack}
              onTabChange={handleTabChange}
              onImageUpdated={handleImageUpdated}
            />
          </Suspense>
        )}
      </main>

      {/* Professional Footer */}
      <Footer
        onGoHome={handleGoHome}
        onNavigate={navigateTo}
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <Suspense fallback={null}>
          <MobileNavDrawer
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onGoHome={handleGoHome}
            onNavigate={navigateTo}
            onOpenModal={(modal) => setActiveModal(modal)}
            onScrollToAllTools={handleScrollToAllTools}
          />
        </Suspense>
      )}

      {/* Info Modals */}
      {activeModal && (
        <Suspense fallback={null}>
          <InfoModals
            modalType={activeModal}
            onClose={() => setActiveModal(null)}
          />
        </Suspense>
      )}

      {/* Reset Confirmation Modal */}
      {isConfirmResetOpen && (
        <Suspense fallback={null}>
          <ConfirmResetModal
            isOpen={isConfirmResetOpen}
            onConfirm={performReset}
            onCancel={() => setIsConfirmResetOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}