export const HERO_SEQUENCE_CONFIG = {
  frameDir: '/images/hero-sequence/',
  frameExt: '.jpg',
  framePad: 4,
  totalFrames: 341,
  cacheKey: '20260416-r2',
} as const

export const REVEAL_FRAME_TIMELINE = {
  phaseStart: 0.3,
  phaseDuration: 0.7,
  progressAtExitStart: 0.82,
} as const

function isSlowHardware() {
  if (typeof navigator === 'undefined') return false
  return (navigator.hardwareConcurrency ?? 4) <= 4
}

export function createHeroSequencePlayer(
  canvas: HTMLCanvasElement,
  { isMobile = false }: { isMobile?: boolean } = {},
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  const context = ctx

  const { frameDir, frameExt, framePad, totalFrames, cacheKey } = HERO_SEQUENCE_CONFIG
  const slow = isSlowHardware()

  const frameUrl = (n: number) =>
    `${frameDir}${String(n).padStart(framePad, '0')}${frameExt}?v=${cacheKey}`

  const frames: (HTMLImageElement | undefined)[] = new Array(totalFrames)
  let loadedFrameIdx: number[] = []
  let totalLoaded = 0
  let drawnIdx = -1
  let lastDrawMs = 0

  function rebuildLoadedFrameIndex() {
    loadedFrameIdx = []
    for (let i = 0; i < frames.length; i++) {
      if (frames[i]?.naturalWidth) loadedFrameIdx.push(i)
    }
    totalLoaded = loadedFrameIdx.length
  }

  function resizeCanvas() {
    const dpr = slow ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
    if (drawnIdx >= 0) {
      const i = drawnIdx
      drawnIdx = -1
      drawFrame(i)
    }
  }

  function drawFrame(i: number) {
    if (i === drawnIdx) return
    if (slow) {
      const now = performance.now()
      if (now - lastDrawMs < 32) return
      lastDrawMs = now
    }
    if (i < 0 || i >= frames.length) return
    const img = frames[i]
    if (!img?.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const s = Math.max(cw / iw, ch / ih)
    const dw = iw * s
    const dh = ih * s
    context.clearRect(0, 0, cw, ch)
    context.drawImage(img, (cw - dw) * 0.5, (ch - dh) * 0.5, dw, dh)
    drawnIdx = i
  }

  function drawFrameAtProgress(progress: number) {
    if (totalLoaded === 0) return
    const clamped = Math.min(1, Math.max(0, progress))
    const loadedPos = Math.round(clamped * (totalLoaded - 1))
    const sourceIdx = loadedFrameIdx[loadedPos]
    if (sourceIdx == null) return
    drawFrame(sourceIdx)
  }

  function probe(n: number): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = frameUrl(n)
    })
  }

  async function probeWithRetry(n: number, attempts = 3) {
    for (let k = 0; k < attempts; k++) {
      const img = await probe(n)
      if (img) return img
    }
    return null
  }

  async function loadFirstBatch() {
    const first = await probeWithRetry(1, 3)
    if (!first) {
      console.error('Hero sequence frame 1 failed to load')
      return 0
    }

    frames[0] = first
    rebuildLoadedFrameIndex()
    resizeCanvas()
    drawFrame(0)

    const speedBatch = 10
    const t0 = performance.now()
    const batchNums = Array.from(
      { length: Math.min(speedBatch, totalFrames - 1) },
      (_, k) => k + 2,
    )
    await Promise.all(
      batchNums.map(async (n) => {
        const img = await probeWithRetry(n, 2)
        if (img) frames[n - 1] = img
      }),
    )

    const elapsed = performance.now() - t0
    rebuildLoadedFrameIndex()
    return elapsed > 4000 ? 3 : elapsed > 2000 ? 2 : 1
  }

  async function loadRemainingFrames(skip: number) {
    const batchEnd = 11
    const toLoad: number[] = []
    for (let i = batchEnd + 1; i <= totalFrames; i++) {
      if (skip <= 1 || i % skip === 0) toLoad.push(i)
    }

    let cursor = 0
    const failed: number[] = []
    const concurrency = slow ? 2 : 6

    const worker = async () => {
      while (cursor < toLoad.length) {
        const n = toLoad[cursor++]
        if (frames[n - 1]?.naturalWidth) continue
        const img = await probeWithRetry(n, 2)
        if (img) {
          frames[n - 1] = img
          rebuildLoadedFrameIndex()
        } else {
          failed.push(n)
        }
      }
    }

    await Promise.all(Array.from({ length: concurrency }, worker))

    for (const n of [...failed]) {
      const img = await probeWithRetry(n, 2)
      if (img) {
        frames[n - 1] = img
        rebuildLoadedFrameIndex()
      }
    }
  }

  canvas.style.willChange = 'transform'

  async function load() {
    let frameSkip = await loadFirstBatch()
    if (isMobile) frameSkip = Math.max(frameSkip, 3)
    if (totalLoaded === 0) return false

    loadRemainingFrames(frameSkip).catch((err) =>
      console.error('Hero sequence background load error:', err),
    )
    return true
  }

  window.addEventListener('resize', resizeCanvas)

  return {
    load,
    drawFrameAtProgress,
    resizeCanvas,
    get totalLoaded() {
      return totalLoaded
    },
    destroy() {
      window.removeEventListener('resize', resizeCanvas)
    },
  }
}
