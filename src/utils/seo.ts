import { EditorTab } from '../types';

export interface RouteSeoInfo {
  path: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  toolTab: EditorTab | null;
  breadcrumb: string;
  relatedTools: Array<{
    title: string;
    path: string;
    description: string;
    toolTab: EditorTab;
  }>;
  features: string[];
  faqItems: Array<{ q: string; a: string }>;
}

export const SEO_ROUTES: Record<string, RouteSeoInfo> = {
  '/': {
    path: '/',
    title: 'Free Online Image Tools – Resize, Compress, Crop & More',
    description:
      'Free online image tools to resize, compress, crop, convert, rotate, flip and remove backgrounds from JPG, PNG and WebP images in your browser.',
    h1: 'Free Online Image Tools',
    tagline:
      'Free online image tools to resize, compress, crop, convert, rotate, flip and remove backgrounds from JPG, PNG, and WebP images directly in your browser. Private and easy to use.',
    toolTab: null,
    breadcrumb: 'Home',
    relatedTools: [
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Set custom pixel dimensions, maintain aspect ratio, and resize JPG, PNG, and WebP images.',
        toolTab: 'resize',
      },
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Reduce image file size while keeping good visual quality with adjustable compression settings.',
        toolTab: 'compress',
      },
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Crop photos with custom handles or standard aspect ratios like 1:1, 4:5, and 16:9.',
        toolTab: 'crop',
      },
      {
        title: 'Convert Image',
        path: '/convert-image',
        description:
          'Convert between JPG, PNG, and WebP formats with transparency support and background options.',
        toolTab: 'output',
      },
      {
        title: 'Rotate & Flip Image',
        path: '/rotate-flip-image',
        description:
          'Rotate photos 90 degrees and flip images horizontally or vertically in your browser.',
        toolTab: 'rotate',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove image backgrounds automatically and create transparent PNG images directly in your browser.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Free browser-based image editing tools',
      'Resize, compress, crop, convert, rotate, flip, and remove image backgrounds',
      'Supports JPG, JPEG, PNG, and WebP images',
      'Client-side image processing for supported tools',
      'No account or registration required for basic image tools',
      'Responsive design for phones, tablets, and desktop computers',
    ],
    faqItems: [
      {
        q: 'What image tools are available on Quick Image Tools?',
        a: 'Quick Image Tools currently provides six browser-based image tools: Resize Image, Compress Image, Crop Image, Convert Image, Rotate & Flip Image, and Remove Background.',
      },
      {
        q: 'Are my images uploaded to a remote server?',
        a: 'The image editing tools are designed to process supported image operations in your browser. Background removal also runs locally in the browser after the required model files are available.',
      },
      {
        q: 'Which image formats are supported?',
        a: 'Quick Image Tools supports JPG, JPEG, PNG, and WebP files across its image editing tools, with supported formats depending on the selected operation.',
      },
      {
        q: 'Can I use Quick Image Tools on a mobile phone?',
        a: 'Yes. The website is designed to work on mobile phones, tablets, and desktop computers, allowing you to select images from your device.',
      },
    ],
  },

  '/resize-image': {
    path: '/resize-image',
    title: 'Resize Image Online – Free JPG, PNG & WebP Image Resizer',
    description:
      'Resize JPG, PNG and WebP images online for free. Set custom dimensions, keep aspect ratio, and resize images quickly in your browser.',
    h1: 'Resize Image Online',
    tagline:
      'Resize JPG, PNG, and WebP images online for free. Set custom dimensions by pixels, maintain aspect ratio, and resize images quickly in your browser.',
    toolTab: 'resize',
    breadcrumb: 'Resize Image',
    relatedTools: [
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Reduce image file size while keeping visual quality after resizing.',
        toolTab: 'compress',
      },
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Trim borders or crop images to standard aspect ratios before resizing.',
        toolTab: 'crop',
      },
      {
        title: 'Convert Image',
        path: '/convert-image',
        description:
          'Convert your resized image between JPG, PNG, and WebP formats.',
        toolTab: 'output',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove the background from an image before resizing the isolated subject.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Resize JPG, PNG, and WebP images by exact pixel width and height',
      'Lock aspect ratio to maintain proportional dimensions without distortion',
      'Social media dimension presets including 1080×1080, 1080×1350, and 1920×1080',
      'Side-by-side original and resized dimension information',
      'Browser-based image resizing without requiring an account',
    ],
    faqItems: [
      {
        q: 'How do I resize an image online without losing its aspect ratio?',
        a: 'Keep the aspect ratio lock enabled when entering your desired width or height. The image resizer calculates the corresponding dimension proportionally.',
      },
      {
        q: 'Which image formats can I resize?',
        a: 'You can resize JPG, JPEG, PNG, and WebP images directly in your browser.',
      },
      {
        q: 'Does resizing an image reduce its file size?',
        a: 'Reducing the pixel dimensions of an image can also reduce the resulting file size because the image contains fewer pixels.',
      },
      {
        q: 'Can I resize an image for social media?',
        a: 'Yes. The resizer includes common dimensions that can be useful for social media posts and other digital content.',
      },
    ],
  },

  '/compress-image': {
    path: '/compress-image',
    title: 'Compress Image Online – Free JPG, PNG & WebP Compressor',
    description:
      'Compress JPG, PNG and WebP images online for free. Reduce image file size while keeping good quality directly in your browser.',
    h1: 'Compress Image Online',
    tagline:
      'Compress JPG, PNG, and WebP images online for free. Reduce image file size while preserving good visual quality directly in your browser.',
    toolTab: 'compress',
    breadcrumb: 'Compress Image',
    relatedTools: [
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Change image dimensions in pixels to achieve smaller file sizes.',
        toolTab: 'resize',
      },
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Trim unnecessary outer areas before compressing your image.',
        toolTab: 'crop',
      },
      {
        title: 'Convert Image',
        path: '/convert-image',
        description:
          'Convert images to another format when a different file type better suits your needs.',
        toolTab: 'output',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove an unwanted image background before compressing the final image.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Adjustable compression quality from 10% to 100%',
      'File size reduction for supported JPG, PNG, and WebP images',
      'Original and compressed file size comparison',
      'Quality presets for different compression needs',
      'Browser-based image compression without requiring an account',
    ],
    faqItems: [
      {
        q: 'How can I compress an image online?',
        a: 'Upload your image, adjust the compression quality, preview the resulting file information, and download the compressed image.',
      },
      {
        q: 'Can I compress JPG, PNG, and WebP images?',
        a: 'The compressor supports the image formats configured by the tool, including JPG, PNG, and WebP files.',
      },
      {
        q: 'Why does PNG compression behave differently from JPG?',
        a: 'PNG and JPG use different image encoding methods. PNG is commonly used when lossless quality or transparency is important, while JPG is commonly used for photographic images.',
      },
    ],
  },

  '/crop-image': {
    path: '/crop-image',
    title: 'Crop Image Online – Free JPG, PNG & WebP Image Cropper',
    description:
      'Crop JPG, PNG and WebP images online for free. Choose custom or popular aspect ratios and download your cropped image in your browser.',
    h1: 'Crop Image Online',
    tagline:
      'Crop JPG, PNG, and WebP images online for free. Choose custom dimensions or standard aspect ratios with interactive crop handles.',
    toolTab: 'crop',
    breadcrumb: 'Crop Image',
    relatedTools: [
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Set specific pixel dimensions for your cropped composition.',
        toolTab: 'resize',
      },
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Reduce file size after cropping out unwanted image areas.',
        toolTab: 'compress',
      },
      {
        title: 'Convert Image',
        path: '/convert-image',
        description:
          'Convert cropped photos between JPG, PNG, and WebP formats.',
        toolTab: 'output',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove the background from your cropped image and create a transparent PNG.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Interactive crop handles for freeform and constrained cropping',
      'Popular aspect ratio presets including 1:1, 4:5, 16:9, 9:16, and 3:2',
      'Rule-of-thirds grid overlay for photo composition',
      'Real-time pixel dimension information',
      'Browser-based cropping for supported JPG, PNG, and WebP images',
    ],
    faqItems: [
      {
        q: 'How do I crop an image to a specific aspect ratio?',
        a: 'Select an aspect ratio preset such as 1:1, 4:5, or 16:9. The crop area maintains the selected ratio while you position it over the image.',
      },
      {
        q: 'What aspect ratio should I use for vertical social media content?',
        a: 'A 9:16 aspect ratio is commonly used for vertical content such as stories and short-form videos.',
      },
      {
        q: 'Does cropping an image affect its resolution?',
        a: 'Cropping removes pixels outside the selected area, so the resulting image normally has fewer pixels than the original.',
      },
    ],
  },

  '/convert-image': {
    path: '/convert-image',
    title: 'Convert Image Online – JPG, PNG & WebP Image Converter',
    description:
      'Convert images online for free between JPG, PNG and WebP formats. Convert images quickly in your browser with no account required.',
    h1: 'Convert Image Online',
    tagline:
      'Convert images online between JPG, PNG, and WebP formats. Convert JPG to PNG, PNG to JPG, or convert to WebP with transparency support.',
    toolTab: 'output',
    breadcrumb: 'Convert Image',
    relatedTools: [
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Adjust output file size after converting between image formats.',
        toolTab: 'compress',
      },
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Adjust width and height in pixels for your converted image.',
        toolTab: 'resize',
      },
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Crop unwanted borders before exporting to your desired format.',
        toolTab: 'crop',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove image backgrounds and create transparent PNG output.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Conversion between JPG, PNG, and WebP formats',
      'Convert JPG to PNG, PNG to JPG, PNG to WebP, and WebP to JPG',
      'Background color option when converting transparent images to JPG',
      'Adjustable quality controls for supported lossy formats',
      'Browser-based image conversion',
    ],
    faqItems: [
      {
        q: 'How do I convert JPG to PNG or PNG to JPG online?',
        a: 'Upload your image, choose the desired output format, configure the available options, and download the converted image.',
      },
      {
        q: 'Why should I convert images to WebP format?',
        a: 'WebP supports both lossy and lossless compression and is commonly used for web images because it can provide efficient file sizes.',
      },
      {
        q: 'What happens to transparent backgrounds when converting PNG to JPG?',
        a: 'JPG does not support transparency, so transparent areas need to be replaced with a background color when creating a JPG file.',
      },
    ],
  },

  '/rotate-flip-image': {
    path: '/rotate-flip-image',
    title: 'Rotate & Flip Image Online – Free Image Rotator',
    description:
      'Rotate and flip JPG, PNG and WebP images online for free. Rotate images and flip them horizontally or vertically in your browser.',
    h1: 'Rotate & Flip Image Online',
    tagline:
      'Rotate and flip JPG, PNG, and WebP images online for free. Rotate 90 degrees clockwise or counter-clockwise, and mirror flip horizontally or vertically.',
    toolTab: 'rotate',
    breadcrumb: 'Rotate & Flip',
    relatedTools: [
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Frame your rotated photo with clean aspect ratio boundaries.',
        toolTab: 'crop',
      },
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Scale your corrected image to target pixel dimensions.',
        toolTab: 'resize',
      },
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Reduce file size after rotating or flipping your image.',
        toolTab: 'compress',
      },
      {
        title: 'Remove Background',
        path: '/background-remover',
        description:
          'Remove the background from your corrected image and create a transparent PNG.',
        toolTab: 'background-remover',
      },
    ],
    features: [
      'Rotate photos 90° clockwise or counter-clockwise',
      'Mirror flip images horizontally or vertically',
      'Automatic canvas dimension handling for rotated images',
      'Real-time orientation preview',
      'Browser-based image rotation and flipping',
    ],
    faqItems: [
      {
        q: 'How do I rotate an image 90 degrees online?',
        a: 'Upload your image and select the clockwise or counter-clockwise rotation option. The preview updates with the new orientation.',
      },
      {
        q: 'How do I flip an image horizontally or vertically?',
        a: 'Use the horizontal or vertical flip option to create a mirrored version of your image.',
      },
      {
        q: 'Does rotating an image degrade quality?',
        a: 'A 90-degree rotation or simple flip does not require the same type of image scaling as resizing, although the final exported file can still depend on its encoding format and settings.',
      },
    ],
  },

  '/background-remover': {
    path: '/background-remover',
    title: 'Remove Image Background Online – Free Background Remover',
    description:
      'Remove image backgrounds online for free. Create transparent PNG images directly in your browser without an API key or server upload.',
    h1: 'Remove Image Background Online',
    tagline:
      'Remove backgrounds from images locally in your browser and create transparent PNGs without an API key or server upload.',
    toolTab: 'background-remover',
    breadcrumb: 'Background Remover',
    relatedTools: [
      {
        title: 'Crop Image',
        path: '/crop-image',
        description:
          'Frame your subject before removing the image background.',
        toolTab: 'crop',
      },
      {
        title: 'Resize Image',
        path: '/resize-image',
        description:
          'Set exact pixel dimensions for your transparent PNG.',
        toolTab: 'resize',
      },
      {
        title: 'Compress Image',
        path: '/compress-image',
        description:
          'Reduce the file size of your finished transparent image.',
        toolTab: 'compress',
      },
      {
        title: 'Convert Image',
        path: '/convert-image',
        description:
          'Convert the resulting transparent PNG to another supported image format.',
        toolTab: 'output',
      },
      {
        title: 'Rotate & Flip Image',
        path: '/rotate-flip-image',
        description:
          'Correct image orientation before or after removing the background.',
        toolTab: 'rotate',
      },
    ],
    features: [
      'Browser-based image background removal',
      'Transparent PNG output with the background removed',
      'No API key required from the user',
      'No account required to use the tool',
      'Supports JPG, PNG, and WebP source images',
    ],
    faqItems: [
      {
        q: 'Are my images uploaded to a server?',
        a: 'The background removal process runs in the browser. The selected image is processed locally rather than being sent to a remote background-removal API.',
      },
      {
        q: 'What format is the result?',
        a: 'The processed result is exported as a PNG with transparent pixels where the background has been removed.',
      },
      {
        q: 'Do I need an API key?',
        a: 'No. The background-removal tool does not require the user to enter an API key.',
      },
      {
        q: 'Can I process another image after finishing one?',
        a: 'Yes. Use the Add Another Image option to select another image without leaving the background-removal tool.',
      },
    ],
  },
};

/**
 * Normalizes any pathname to match one of the SEO routes,
 * falling back to the homepage.
 */
export function getSeoForPath(pathname: string): RouteSeoInfo {
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  return SEO_ROUTES[cleanPath] || SEO_ROUTES['/'];
}

/**
 * Maps an EditorTab to its corresponding canonical route path.
 */
export function getPathForTab(tab: EditorTab | null): string {
  switch (tab) {
    case 'resize':
      return '/resize-image';

    case 'compress':
      return '/compress-image';

    case 'crop':
      return '/crop-image';

    case 'output':
      return '/convert-image';

    case 'rotate':
      return '/rotate-flip-image';

    case 'background-remover':
      return '/background-remover';

    default:
      return '/';
  }
}

/**
 * Main website origin used for canonical URLs and structured data.
 */
export const SITE_ORIGIN = 'https://quick-image-tools.ai.studio';

/**
 * Updates document metadata, canonical URL,
 * Open Graph/Twitter metadata, and Schema.org JSON-LD.
 */
export function applySeoMetadata(seo: RouteSeoInfo) {
  if (typeof document === 'undefined') return;

  // 1. Document title
  document.title = seo.title;

  // 2. Meta description
  let metaDesc = document.querySelector('meta[name="description"]');

  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }

  metaDesc.setAttribute('content', seo.description);

  // 3. Canonical URL
  const canonicalUrl = `${SITE_ORIGIN}${seo.path === '/' ? '' : seo.path}`;

  let linkCanonical = document.querySelector('link[rel="canonical"]');

  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }

  linkCanonical.setAttribute('href', canonicalUrl);

  // 4. Open Graph metadata
  const setMetaProperty = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);

    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }

    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', seo.title);
  setMetaProperty('og:description', seo.description);
  setMetaProperty('og:url', canonicalUrl);
  setMetaProperty('og:site_name', 'Quick Image Tools');
  setMetaProperty('og:type', 'website');

  // 5. Twitter metadata
  const setMetaName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);

    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }

    el.setAttribute('content', content);
  };

  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', seo.title);
  setMetaName('twitter:description', seo.description);

  // 6. Schema.org structured data
  let scriptLd = document.getElementById('schema-structured-data');

  if (!scriptLd) {
    scriptLd = document.createElement('script');
    scriptLd.setAttribute('type', 'application/ld+json');
    scriptLd.setAttribute('id', 'schema-structured-data');
    document.head.appendChild(scriptLd);
  }

  const structuredData: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Quick Image Tools',
      url: SITE_ORIGIN,
      description:
        'Free online image tools for resizing, compressing, cropping, converting, rotating, flipping, and removing image backgrounds.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `Quick Image Tools - ${seo.h1}`,
      url: canonicalUrl,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript',
      description: seo.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: seo.features,
    },
  ];

  // 7. Breadcrumb structured data for tool pages
  if (seo.path !== '/') {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_ORIGIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo.breadcrumb,
          item: canonicalUrl,
        },
      ],
    });
  }

  /*
   * The visible FAQ section remains on the website for users.
   * FAQPage JSON-LD is intentionally not generated here because
   * Google does not currently provide the normal FAQ rich-result
   * treatment for general websites.
   */

  scriptLd.textContent = JSON.stringify(structuredData, null, 2);
}