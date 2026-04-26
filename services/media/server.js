import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Database from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { createReadStream, existsSync, mkdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs'
import { resolve, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../app/.env.local') })

const PORT         = process.env.MEDIA_SERVICE_PORT ?? 3300
const STORAGE_DIR  = resolve(__dirname, 'storage')
const ICONS_DIR    = resolve(__dirname, 'icons')
const DB_PATH      = resolve(__dirname, 'data/media.db')

mkdirSync(STORAGE_DIR, { recursive: true })
mkdirSync(ICONS_DIR,   { recursive: true })
mkdirSync(resolve(__dirname, 'data'), { recursive: true })

// ── Database ──────────────────────────────────────────────────────────────────

const db = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS icon_sets (
    id           TEXT PRIMARY KEY,
    source_id    TEXT NOT NULL,
    generated_at TEXT NOT NULL DEFAULT (datetime('now')),
    files        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    title       TEXT DEFAULT '',
    description TEXT DEFAULT '',
    mime_type   TEXT NOT NULL,
    extension   TEXT NOT NULL,
    size        INTEGER NOT NULL,
    width       INTEGER,
    height      INTEGER,
    duration    REAL,
    storage_key TEXT NOT NULL UNIQUE,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// Migration — add title column if not exists (safe for existing DBs)
try { db.exec(`ALTER TABLE media ADD COLUMN title TEXT DEFAULT ''`) } catch {}

// ── Multer (memory storage — we write manually after processing) ──────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
})

// ── App ───────────────────────────────────────────────────────────────────────

const app = express()
app.use(cors())
app.use(express.json())

// ── GET /media — list all media ───────────────────────────────────────────────

app.get('/media', (_req, res) => {
  const rows = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all()
  res.json({ ok: true, items: rows })
})

// ── POST /media/upload — upload image or video ────────────────────────────────

app.post('/media/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ ok: false, error: 'No file provided' })

    const id        = uuidv4()
    const ext       = extname(file.originalname).replace('.', '').toLowerCase() || 'bin'
    const storageKey = `${id}.${ext}`
    const destPath  = resolve(STORAGE_DIR, storageKey)
    const isImage   = file.mimetype.startsWith('image/')
    const isVideo   = file.mimetype.startsWith('video/')

    let width = null, height = null, duration = null, buffer = file.buffer

    if (isImage) {
      const meta = await sharp(buffer).metadata()
      width  = meta.width  ?? null
      height = meta.height ?? null

      // Crop data from client (x, y, w, h in natural px)
      const crop = req.body.crop ? JSON.parse(req.body.crop) : null
      if (crop) {
        buffer = await sharp(buffer)
          .extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h })
          .toBuffer()
        width  = crop.w
        height = crop.h
      }
    }

    // Write file to storage
    await import('fs/promises').then(fs => fs.writeFile(destPath, buffer))

    const row = {
      id,
      name:        file.originalname,
      title:       req.body.title || '',
      description: req.body.description || '',
      mime_type:   file.mimetype,
      extension:   ext,
      size:        buffer.length,
      width,
      height,
      duration,
      storage_key: storageKey,
    }

    db.prepare(`
      INSERT INTO media (id, name, title, description, mime_type, extension, size, width, height, duration, storage_key)
      VALUES (@id, @name, @title, @description, @mime_type, @extension, @size, @width, @height, @duration, @storage_key)
    `).run(row)

    res.json({ ok: true, item: db.prepare('SELECT * FROM media WHERE id = ?').get(id) })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

// ── PATCH /media/:id — update title/description ──────────────────────────────

app.patch('/media/:id', (req, res) => {
  const { title, description } = req.body
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ ok: false, error: 'Not found' })

  db.prepare('UPDATE media SET title = ?, description = ? WHERE id = ?')
    .run(title ?? item.title ?? '', description ?? item.description ?? '', req.params.id)

  res.json({ ok: true, item: db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id) })
})

// ── DELETE /media/:id ─────────────────────────────────────────────────────────

app.delete('/media/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).json({ ok: false, error: 'Not found' })

  const filePath = resolve(STORAGE_DIR, item.storage_key)
  if (existsSync(filePath)) {
    try { unlinkSync(filePath) } catch {}
  }

  db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ── GET /media/:id/file — serve file ─────────────────────────────────────────

app.get('/media/:id/file', (req, res) => {
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!item) return res.status(404).end()

  const filePath = resolve(STORAGE_DIR, item.storage_key)
  if (!existsSync(filePath)) return res.status(404).end()

  res.setHeader('Content-Type', item.mime_type)
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  createReadStream(filePath).pipe(res)
})

// ── GET /media/:id/thumb — thumbnail for images ───────────────────────────────

app.get('/media/:id/thumb', async (req, res) => {
  const item = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!item || !item.mime_type.startsWith('image/')) return res.status(404).end()

  const filePath = resolve(STORAGE_DIR, item.storage_key)
  if (!existsSync(filePath)) return res.status(404).end()

  try {
    const thumb = await sharp(filePath).resize(200, 200, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(thumb)
  } catch {
    res.status(500).end()
  }
})

// ── POST /media/generate-icons — generate full icon set from a media image ────

app.post('/media/generate-icons', async (req, res) => {
  try {
    const { media_id } = req.body
    if (!media_id) return res.status(400).json({ ok: false, error: 'media_id required' })

    const item = db.prepare('SELECT * FROM media WHERE id = ?').get(media_id)
    if (!item) return res.status(404).json({ ok: false, error: 'Media not found' })
    if (!item.mime_type.startsWith('image/')) return res.status(400).json({ ok: false, error: 'Source must be an image' })

    const srcPath = resolve(STORAGE_DIR, item.storage_key)
    if (!existsSync(srcPath)) return res.status(404).json({ ok: false, error: 'Source file not found' })

    const id    = uuidv4()
    const dir   = resolve(ICONS_DIR, id)
    mkdirSync(dir, { recursive: true })

    // Generate all sizes via sharp
    const sizes = [16, 32, 180, 192, 512]
    const pngBuffers = {}
    for (const size of sizes) {
      pngBuffers[size] = await sharp(srcPath)
        .resize(size, size, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer()
    }

    // Write PNGs
    writeFileSync(resolve(dir, 'favicon-16.png'),       pngBuffers[16])
    writeFileSync(resolve(dir, 'favicon-32.png'),       pngBuffers[32])
    writeFileSync(resolve(dir, 'apple-touch-icon.png'), pngBuffers[180])
    writeFileSync(resolve(dir, 'icon-192.png'),         pngBuffers[192])
    writeFileSync(resolve(dir, 'icon-512.png'),         pngBuffers[512])

    // Generate .ico (16 + 32 combined)
    const icoBuffer = await pngToIco([pngBuffers[16], pngBuffers[32]])
    writeFileSync(resolve(dir, 'favicon.ico'), icoBuffer)

    // Generate OG image (1200×630) — center-crop from source
    const ogBuffer = await sharp(srcPath)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 90 })
      .toBuffer()
    writeFileSync(resolve(dir, 'og-image.jpg'), ogBuffer)

    // Generate manifest.json
    const manifest = {
      name: 'Fractera Light',
      short_name: 'Fractera',
      icons: [
        { src: `${process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://localhost:3300'}/media/icons/${id}/file/icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://localhost:3300'}/media/icons/${id}/file/icon-512.png`, sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
    }
    writeFileSync(resolve(dir, 'manifest.json'), JSON.stringify(manifest, null, 2))

    const files = {
      favicon_ico:        `${id}/favicon.ico`,
      favicon_16:         `${id}/favicon-16.png`,
      favicon_32:         `${id}/favicon-32.png`,
      apple_touch_icon:   `${id}/apple-touch-icon.png`,
      icon_192:           `${id}/icon-192.png`,
      icon_512:           `${id}/icon-512.png`,
      og_image:           `${id}/og-image.jpg`,
      manifest:           `${id}/manifest.json`,
    }

    db.prepare(`
      INSERT INTO icon_sets (id, source_id, files) VALUES (?, ?, ?)
    `).run(id, media_id, JSON.stringify(files))

    res.json({ ok: true, id, files })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

// ── GET /media/icons/current — latest generated icon set ─────────────────────

app.get('/media/icons/current', (_req, res) => {
  const row = db.prepare('SELECT * FROM icon_sets ORDER BY generated_at DESC LIMIT 1').get()
  if (!row) return res.status(404).json({ ok: false, error: 'No icon sets generated yet' })
  res.json({ ok: true, ...row, files: JSON.parse(row.files) })
})

// ── GET /media/icons — list all icon sets ────────────────────────────────────

app.get('/media/icons', (_req, res) => {
  const rows = db.prepare('SELECT * FROM icon_sets ORDER BY generated_at DESC').all()
  res.json({ ok: true, items: rows.map(r => ({ ...r, files: JSON.parse(r.files) })) })
})

// ── GET /media/icons/:id/file/:name — serve icon file ────────────────────────

app.get('/media/icons/:id/file/:name', (req, res) => {
  const row = db.prepare('SELECT * FROM icon_sets WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).end()

  const filePath = resolve(ICONS_DIR, req.params.id, req.params.name)
  if (!existsSync(filePath)) return res.status(404).end()

  const ext = req.params.name.split('.').pop()
  const mime = ext === 'ico' ? 'image/x-icon'
    : ext === 'jpg' ? 'image/jpeg'
    : ext === 'json' ? 'application/json'
    : 'image/png'

  res.setHeader('Content-Type', mime)
  res.setHeader('Cache-Control', 'public, max-age=3600')
  createReadStream(filePath).pipe(res)
})

app.listen(PORT, () => {
  console.log(`Media service listening on http://localhost:${PORT}`)
  console.log(`Storage: ${STORAGE_DIR}`)
  console.log(`DB:      ${DB_PATH}`)
})
