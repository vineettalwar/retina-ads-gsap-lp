const POOLS = [
  ' ',
  '·.,',
  ':;`-~^',
  '=+<>?!:;',
  '|/\\()[]{}«»',
  '÷×±≈≠≤≥∞∑∏√∫',
  '¤†‡§¶©®™°¬',
  '%&#$@¥€£¢',
]

let seed = 42
function rand() {
  seed = (seed * 16807 + 0) % 2147483647
  return seed / 2147483647
}

export type AsciiResult = {
  text: string
  poolGrid: number[][]
}

export function imageToAscii(img: HTMLImageElement, cols: number): AsciiResult {
  seed = 42
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return { text: '', poolGrid: [] }

  const aspect = img.height / img.width
  const rows = Math.round(cols * aspect)
  canvas.width = cols
  canvas.height = rows
  ctx.drawImage(img, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const lines: string[] = []
  const poolGrid: number[][] = []

  for (let y = 0; y < rows; y++) {
    let line = ''
    const poolRow: number[] = []
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a < 15) {
        line += ' '
        poolRow.push(-1)
        continue
      }
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      brightness *= a / 255
      const pi = Math.min(Math.floor(brightness * (POOLS.length - 1) * 0.8), POOLS.length - 1)
      const pool = POOLS[pi]
      line += pool[Math.floor(rand() * pool.length)]
      poolRow.push(pi)
    }
    lines.push(line)
    poolGrid.push(poolRow)
  }

  return { text: lines.join('\n'), poolGrid }
}

function esc(ch: string) {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

export function setupAsciiHover(preEl: HTMLPreElement, poolGrid: number[][]) {
  let origLines: string[] | null = null
  let origGrid: string[][] | null = null
  let mxC = -1000
  let myC = -1000
  const radius = 2.5
  const cols = poolGrid[0]?.length ?? 1
  const rows = poolGrid.length
  const noise: number[][] = []
  const hitTime: number[][] = []
  const cellDuration: number[][] = []
  let animating = false

  for (let ny = 0; ny < rows; ny++) {
    const nr: number[] = []
    const ht: number[] = []
    const cd: number[] = []
    for (let nx = 0; nx < cols; nx++) {
      const h = ((Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453) % 1 + 1) % 1
      nr.push(h * 5 - 2.5)
      ht.push(0)
      cd.push(h > 0.5 ? 200 : 100)
    }
    noise.push(nr)
    hitTime.push(ht)
    cellDuration.push(cd)
  }

  function init() {
    origLines = preEl.textContent?.split('\n') ?? []
    origGrid = origLines.map((l) => l.split(''))
  }

  const onMove = (e: MouseEvent) => {
    if (!origGrid) init()
    const rect = preEl.getBoundingClientRect()
    const charW = rect.width / cols
    const charH = rect.height / rows
    mxC = (e.clientX - rect.left) / charW
    myC = (e.clientY - rect.top) / charH
    const now = performance.now()
    const maxR = radius + 3
    const yMin = Math.max(0, Math.floor(myC - maxR))
    const yMax = Math.min(rows - 1, Math.ceil(myC + maxR))
    const xMin = Math.max(0, Math.floor(mxC - maxR))
    const xMax = Math.min(cols - 1, Math.ceil(mxC + maxR))
    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        const dx = x - mxC
        const dy = y - myC
        if (dx * dx + dy * dy < (radius + noise[y][x]) * (radius + noise[y][x])) {
          hitTime[y][x] = now
        }
      }
    }
    if (!animating) {
      animating = true
      tick()
    }
  }

  const onLeave = () => {
    mxC = -1000
    myC = -1000
  }

  function tick() {
    const now = performance.now()
    let anyActive = false
    let html = ''
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const pi = poolGrid[y][x]
        if (pi < 0 || pi === 0) {
          html += ' '
          continue
        }
        const elapsed = now - hitTime[y][x]
        if (hitTime[y][x] > 0 && elapsed < cellDuration[y][x]) {
          anyActive = true
          const idx = POOLS.length - 1 - pi
          const pool = POOLS[idx]
          const ch = pool[Math.floor(Math.random() * pool.length)]
          html += `<span style="color:#0a0a0a;background:#ff3b14">${esc(ch)}</span>`
        } else {
          html += esc(origGrid?.[y]?.[x] ?? ' ')
        }
      }
      html += '\n'
    }
    preEl.innerHTML = html
    if (anyActive) {
      requestAnimationFrame(tick)
    } else {
      animating = false
      if (origLines) preEl.textContent = origLines.join('\n')
    }
  }

  preEl.addEventListener('mousemove', onMove)
  preEl.addEventListener('mouseleave', onLeave)

  return () => {
    preEl.removeEventListener('mousemove', onMove)
    preEl.removeEventListener('mouseleave', onLeave)
  }
}

export function loadAsciiFromImage(src: string, targetId: string, cols: number) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const el = document.getElementById(targetId) as HTMLPreElement | null
    if (!el) return
    const result = imageToAscii(img, cols)
    el.textContent = result.text
    setupAsciiHover(el, result.poolGrid)
  }
  img.src = src
}
