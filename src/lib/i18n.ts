export function getCharHTML(ch: string): string {
  if (ch === ' ') return '&nbsp;'
  if (ch === '🡲' || ch === '🡺') {
    return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></svg>'
  }
  if (ch === '🡼') {
    return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></g></svg>'
  }
  if (ch === '🞣') {
    return '<svg style="width: 0.9em; height: 0.9em; vertical-align: -0.1em; transform: translateY(-0.1em);" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"/></svg>'
  }
  return ch
}

export function buildChrHoverElement(text: string): DocumentFragment {
  const frag = document.createDocumentFragment()
  ;[...text].forEach((ch, i) => {
    const wrap = document.createElement('span')
    wrap.className = 'ch-wrap'
    wrap.style.setProperty('--i', String(i))
    const chHTML = getCharHTML(ch)
    const top = document.createElement('span')
    top.className = 'ch-top'
    top.innerHTML = chHTML
    const bot = document.createElement('span')
    bot.className = 'ch-bot'
    bot.innerHTML = chHTML
    wrap.appendChild(top)
    wrap.appendChild(bot)
    frag.appendChild(wrap)
  })
  return frag
}

if (typeof window !== 'undefined') {
  ;(window as Window & { getCharHTML?: typeof getCharHTML }).getCharHTML = getCharHTML
}
