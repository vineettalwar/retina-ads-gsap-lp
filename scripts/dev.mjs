import { spawn } from 'child_process'
import { createServer } from 'net'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const nextBin = path.join(root, 'node_modules', '.bin', 'next')
const lockPath = path.join(root, '.next', 'dev', 'lock')
const portFile = path.join(root, '.next', 'dev-port')

function isProcessAlive(pid) {
  if (!pid) return false
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function readDevLock() {
  if (!existsSync(lockPath)) return null
  try {
    return JSON.parse(readFileSync(lockPath, 'utf8'))
  } catch {
    return null
  }
}

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const probe = (port) => {
      const server = createServer()

      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          probe(port + 1)
          return
        }
        reject(err)
      })

      server.once('listening', () => {
        server.close(() => resolve(port))
      })

      server.listen(port)
    }

    probe(startPort)
  })
}

function writePort(port) {
  mkdirSync(path.join(root, '.next'), { recursive: true })
  writeFileSync(portFile, String(port))
}

const lock = readDevLock()
if (lock && isProcessAlive(lock.pid)) {
  const url = lock.appUrl || `http://localhost:${lock.port}`
  writePort(lock.port)
  console.log(`Dev server already running at ${url}`)
  process.exit(0)
}

if (lock && existsSync(lockPath)) {
  unlinkSync(lockPath)
}

const preferredPort = Number(process.env.PORT || process.env.DEV_PORT || 3000)
const port = await findAvailablePort(preferredPort)

writePort(port)
console.log(`Starting dev server on http://localhost:${port}`)

const child = spawn(nextBin, ['dev', '-p', String(port)], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, PORT: String(port) },
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})

process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
