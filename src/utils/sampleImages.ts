/**
 * Generates local in-memory sample images as genuine browser File objects
 * for easy testing and instant demonstration.
 */
export async function createSampleImage(
  type: 'landscape' | 'portrait' | 'transparent' = 'landscape'
): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas');

  let width = 1920;
  let height = 1080;
  let filename = 'sample-landscape.jpg';
  let mimeType = 'image/jpeg';

  if (type === 'portrait') {
    width = 1080;
    height = 1920;
    filename = 'sample-portrait.jpg';
    mimeType = 'image/jpeg';
  } else if (type === 'transparent') {
    width = 1200;
    height = 1200;
    filename = 'sample-badge.png';
    mimeType = 'image/png';
  }

  canvas.width = width;
  canvas.height = height;

  if (type === 'transparent') {
    // Transparent background with geometric art
    ctx.clearRect(0, 0, width, height);

    // Glowing circle in center
    const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width / 2.2);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // Floating glass badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.roundRect?.(width * 0.25, height * 0.4, width * 0.5, height * 0.2, 30);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Quick Image Tools', width / 2, height / 2 - 15);

    ctx.fillStyle = '#64748b';
    ctx.font = '32px system-ui, sans-serif';
    ctx.fillText('Transparent PNG Sample', width / 2, height / 2 + 35);
  } else {
    // Rich scenic landscape gradient with mountain silhouettes & sun
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (type === 'landscape') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.3, '#1e293b');
      skyGrad.addColorStop(0.6, '#f97316');
      skyGrad.addColorStop(0.85, '#fde047');
      skyGrad.addColorStop(1, '#ffedd5');
    } else {
      skyGrad.addColorStop(0, '#312e81');
      skyGrad.addColorStop(0.4, '#4f46e5');
      skyGrad.addColorStop(0.7, '#ec4899');
      skyGrad.addColorStop(1, '#fbbf24');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Sun
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.55, width * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountains
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.65);
    ctx.lineTo(width * 0.25, height * 0.52);
    ctx.lineTo(width * 0.55, height * 0.68);
    ctx.lineTo(width * 0.8, height * 0.56);
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Foreground mountains
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.8);
    ctx.lineTo(width * 0.35, height * 0.68);
    ctx.lineTo(width * 0.7, height * 0.82);
    ctx.lineTo(width, height * 0.75);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Text watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${width} × ${height} px`, width - 50, height - 50);
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed blob creation'))), mimeType, 0.92);
  });

  return new File([blob], filename, { type: mimeType });
}
