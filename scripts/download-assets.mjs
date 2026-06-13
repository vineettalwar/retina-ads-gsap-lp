import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const BASE_URL = 'https://retina-ads.vercel.app';

const assets = [
  // Fonts
  { url: '/assets/fonts/Breton.woff2', dest: 'public/fonts/Breton.woff2' },
  { url: '/assets/fonts/Machine.otf', dest: 'public/fonts/Machine.otf' },
  { url: '/assets/fonts/Zirena.woff2', dest: 'public/fonts/Zirena.woff2' },
  // Profile
  { url: '/assets/images/profile/prometheus.jpg', dest: 'public/images/profile/prometheus.jpg' },
  // Gallery
  { url: '/assets/images/retina-gallery/gallery-1.png', dest: 'public/images/retina-gallery/gallery-1.png' },
  { url: '/assets/images/retina-gallery/gallery-2.png', dest: 'public/images/retina-gallery/gallery-2.png' },
  { url: '/assets/images/retina-gallery/gallery-3.png', dest: 'public/images/retina-gallery/gallery-3.png' },
  { url: '/assets/images/retina-gallery/gallery-4.png', dest: 'public/images/retina-gallery/gallery-4.png' },
  { url: '/assets/images/retina-gallery/gallery-5.png', dest: 'public/images/retina-gallery/gallery-5.png' },
  { url: '/assets/images/retina-gallery/gallery-6.png', dest: 'public/images/retina-gallery/gallery-6.png' },
  { url: '/assets/images/retina-gallery/gallery-7.png', dest: 'public/images/retina-gallery/gallery-7.png' },
  { url: '/assets/images/retina-gallery/gallery-8.png', dest: 'public/images/retina-gallery/gallery-8.png' },
  // Art images
  { url: '/assets/images/art/Untitled1.png', dest: 'public/images/art/Untitled1.png' },
  { url: '/assets/images/art/Untitled2.png', dest: 'public/images/art/Untitled2.png' },
  // Hero shader background
  { url: '/assets/images/shader%20background/background.png', dest: 'public/images/shader-background/background.png' },
  // Footer ASCII source images
  { url: '/assets/images/footer/left.png', dest: 'public/images/footer/left.png' },
  { url: '/assets/images/footer/right.png', dest: 'public/images/footer/right.png' },
  // Videos
  { url: '/assets/videos/ads/ad-01.mp4', dest: 'public/videos/ads/ad-01.mp4' },
  { url: '/assets/videos/ads/ad-02.mp4', dest: 'public/videos/ads/ad-02.mp4' },
  { url: '/assets/videos/ads/ad-03.mp4', dest: 'public/videos/ads/ad-03.mp4' },
  { url: '/assets/videos/ads/ad-04.mp4', dest: 'public/videos/ads/ad-04.mp4' },
  { url: '/assets/videos/ads/ad-05.mp4', dest: 'public/videos/ads/ad-05.mp4' },
  { url: '/assets/videos/ads/ad-06.mp4', dest: 'public/videos/ads/ad-06.mp4' },
  { url: '/assets/videos/ads/ad-07.mp4', dest: 'public/videos/ads/ad-07.mp4' },
  { url: '/assets/videos/ads/ad-08.mp4', dest: 'public/videos/ads/ad-08.mp4' },
  { url: '/assets/videos/ads/ad-09.mp4', dest: 'public/videos/ads/ad-09.mp4' },
  { url: '/assets/videos/ads/ad-10.mp4', dest: 'public/videos/ads/ad-10.mp4' },
  // Favicon
  { url: '/favicon.ico', dest: 'public/seo/favicon.ico' },
  { url: '/favicon.png', dest: 'public/seo/favicon.png' },
];

async function download(asset) {
  const fullUrl = BASE_URL + asset.url;
  const dir = path.dirname(asset.dest);
  mkdirSync(dir, { recursive: true });

  console.log(`Downloading ${asset.url}...`);
  const res = await fetch(fullUrl);
  if (!res.ok) {
    console.warn(`  SKIP ${asset.url} (${res.status})`);
    return;
  }
  const out = createWriteStream(asset.dest);
  await pipeline(res.body, out);
  console.log(`  ✓ ${asset.dest}`);
}

async function downloadBatch(items, batchSize = 4) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(download));
  }
}

console.log('🚀 Downloading Retina Ads assets...\n');
await downloadBatch(assets);
console.log('\n✅ Done!');
