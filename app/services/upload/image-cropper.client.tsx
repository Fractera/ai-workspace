"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export type CropMode = "horizontal" | "square" | "vertical"

const RATIOS: Record<CropMode, { w: number; h: number }> = {
  horizontal: { w: 16, h: 9 },
  square:     { w: 1,  h: 1 },
  vertical:   { w: 9,  h: 16 },
}

type Props = {
  src: string
  onDone: (blob: Blob, cropMode: CropMode) => void
  onCancel: () => void
}

export function ImageCropper({ src, onDone, onCancel }: Props) {
  const MAX = 280
  const [cropMode, setCropMode] = useState<CropMode>("horizontal")
  const ratio = RATIOS[cropMode]
  const r   = ratio.w / ratio.h
  const W   = r >= 1 ? MAX : Math.round(MAX * r)
  const H   = r >= 1 ? Math.round(MAX / r) : MAX
  const outW = Math.min(ratio.w * 512, 1200)
  const outH = Math.round(outW * ratio.h / ratio.w)

  const [scale, setScale]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef   = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new globalThis.Image()
    img.onload = () => {
      imgRef.current = img
      setScale(Math.min(W / img.naturalWidth, H / img.naturalHeight))
      setOffset({ x: 0, y: 0 })
    }
    img.src = src
  }, [src, cropMode])

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(img, offset.x + (W - w) / 2, offset.y + (H - h) / 2, w, h)
  }, [scale, offset, W, H])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      setOffset({ x: dragRef.current.ox + ev.clientX - dragRef.current.startX, y: dragRef.current.oy + ev.clientY - dragRef.current.startY })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const handleDone = () => {
    const out = document.createElement("canvas")
    out.width = outW
    out.height = outH
    const ctx = out.getContext("2d")
    const img = imgRef.current
    if (!ctx || !img) return
    const rx = outW / W, ry = outH / H
    ctx.drawImage(
      img,
      offset.x * rx + (outW - img.naturalWidth * scale * rx) / 2,
      offset.y * ry + (outH - img.naturalHeight * scale * ry) / 2,
      img.naturalWidth * scale * rx,
      img.naturalHeight * scale * ry
    )
    out.toBlob((blob) => { if (blob) onDone(blob, cropMode) }, "image/jpeg", 0.92)
  }

  if (typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
      <div className="bg-background rounded-xl p-4 flex flex-col gap-3 shadow-xl" style={{ width: Math.max(W + 48, 320) }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Crop image</span>
          <div className="flex gap-1">
            {(["horizontal", "square", "vertical"] as CropMode[]).map((m) => (
              <button key={m} type="button" onClick={() => setCropMode(m)}
                className={`text-[10px] px-2 py-1 rounded border transition-colors ${cropMode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                {m === "horizontal" ? "16:9" : m === "square" ? "1:1" : "9:16"}
              </button>
            ))}
          </div>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={13} />
          </button>
        </div>
        <canvas
          ref={canvasRef} width={W} height={H}
          className="rounded-lg border border-border cursor-grab active:cursor-grabbing bg-muted/30 self-center select-none"
          style={{ width: W, height: H }}
          onMouseDown={onMouseDown}
        />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">Scale</span>
          <input type="range" min={0.05} max={4} step={0.01} value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full accent-primary" />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel}
            className="text-[11px] px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleDone}
            className="text-[11px] px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
