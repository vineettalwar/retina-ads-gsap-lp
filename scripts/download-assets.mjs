import { createWriteStream, existsSync, mkdirSync, statSync } from 'fs';
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
  { url: '/assets/favicon/favicon.ico', dest: 'public/seo/favicon.ico' },
  { url: '/assets/favicon/favicon.png', dest: 'public/seo/favicon.png' },
];

const HERO_SEQUENCE = {
  totalFrames: 341,
  pad: 4,
  srcDir: '/assets/images/hero-sequence',
  destDir: 'public/images/hero-sequence',
};

async function download(asset, { skipExisting = false } = {}) {
  const fullUrl = BASE_URL + asset.url;
  const dir = path.dirname(asset.dest);
  mkdirSync(dir, { recursive: true });

  if (skipExisting && existsSync(asset.dest) && statSync(asset.dest).size > 0) {
    return 'skipped';
  }

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(fullUrl);
      if (!res.ok) {
        lastError = `${res.status}`;
        continue;
      }
      const out = createWriteStream(asset.dest);
      await pipeline(res.body, out);
      return 'ok';
    } catch (err) {
      lastError = err.message;
    }
  }

  console.warn(`  SKIP ${asset.url} (${lastError})`);
  return 'failed';
}

async function downloadBatch(items, batchSize = 4, options = {}) {
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((item) => download(item, options)));
    for (const result of results) {
      if (result === 'ok') ok += 1;
      else if (result === 'skipped') skipped += 1;
      else failed += 1;
    }
    if (options.onProgress && (i + batchSize) % (batchSize * 10) === 0) {
      options.onProgress(i + batchSize, items.length, { ok, skipped, failed });
    }
  }

  return { ok, skipped, failed };
}

function buildHeroSequenceAssets() {
  const items = [];
  for (let n = 1; n <= HERO_SEQUENCE.totalFrames; n += 1) {
    const name = String(n).padStart(HERO_SEQUENCE.pad, '0');
    items.push({
      url: `${HERO_SEQUENCE.srcDir}/${name}.jpg`,
      dest: `${HERO_SEQUENCE.destDir}/${name}.jpg`,
    });
  }
  return items;
}

console.log('🚀 Downloading Retina Ads assets...\n');
const staticResult = await downloadBatch(assets, 4);
console.log(`Static assets: ${staticResult.ok} downloaded, ${staticResult.failed} failed\n`);

console.log(`Downloading hero sequence (${HERO_SEQUENCE.totalFrames} frames)...\n`);
const heroAssets = buildHeroSequenceAssets();
const heroResult = await downloadBatch(heroAssets, 8, {
  skipExisting: true,
  onProgress(done, total, stats) {
    console.log(`  Progress: ${Math.min(done, total)}/${total} (${stats.ok} new, ${stats.skipped} skipped, ${stats.failed} failed)`);
  },
});
console.log(`Hero sequence: ${heroResult.ok} downloaded, ${heroResult.skipped} skipped, ${heroResult.failed} failed`);
console.log('\n✅ Done!');
