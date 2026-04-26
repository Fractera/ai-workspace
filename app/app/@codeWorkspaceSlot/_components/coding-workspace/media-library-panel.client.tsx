"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Trash2, Copy, Eye, ImagePlus, X, Check, Film, Image as ImageIcon, Search, Pencil } from "lucide-react";
import { toast } from "sonner";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://localhost:3300";

type MediaItem = {
  id: string;
  name: string;
  title: string;
  description: string;
  mime_type: string;
  extension: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  storage_key: string;
  created_at: string;
};

type CropMode = "horizontal" | "square" | "vertical";

const CROP_RATIOS: Record<CropMode, { w: number; h: number }> = {
  horizontal: { w: 16, h: 9 },
  square:     { w: 1,  h: 1 },
  vertical:   { w: 9,  h: 16 },
};

type Props = { onClose: () => void };

// ── ImageCropper (ported from Fractera Pro, no deps) ──────────────────────────

function ImageCropper({ src, cropMode, onDone, onCancel }: {
  src: string;
  cropMode: CropMode;
  onDone: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const MAX   = 280;
  const ratio = CROP_RATIOS[cropMode];
  const r     = ratio.w / ratio.h;
  const W     = r >= 1 ? MAX : Math.round(MAX * r);
  const H     = r >= 1 ? Math.round(MAX / r) : MAX;
  const outW  = Math.min(ratio.w * 512, 1200);
  const outH  = Math.round(outW * ratio.h / ratio.w);

  const [scale, setScale]   = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef   = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const fit = Math.min(W / img.naturalWidth, H / img.naturalHeight);
      setScale(fit);
      setOffset({ x: 0, y: 0 });
    };
    img.src = src;
  }, [src, W, H]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, offset.x + (W - w) / 2, offset.y + (H - h) / 2, w, h);
  }, [scale, offset, W, H]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setOffset({ x: dragRef.current.ox + ev.clientX - dragRef.current.startX, y: dragRef.current.oy + ev.clientY - dragRef.current.startY });
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleDone = () => {
    const out = document.createElement("canvas");
    out.width = outW; out.height = outH;
    const ctx = out.getContext("2d");
    const img = imgRef.current;
    if (!ctx || !img) return;
    const rx = outW / W, ry = outH / H;
    ctx.drawImage(img, offset.x * rx + (outW - img.naturalWidth * scale * rx) / 2, offset.y * ry + (outH - img.naturalHeight * scale * ry) / 2, img.naturalWidth * scale * rx, img.naturalHeight * scale * ry);
    out.toBlob((blob) => { if (blob) onDone(blob); }, "image/jpeg", 0.92);
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
      <div className="bg-background rounded-xl p-4 flex flex-col gap-3 shadow-xl" style={{ width: Math.max(W + 48, 320) }}>
        <span className="text-xs font-semibold text-foreground">Crop image</span>
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
    </div>
  );
}

// ── Preview popup ─────────────────────────────────────────────────────────────

function PreviewPopup({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const isImage = item.mime_type.startsWith("image/");
  const isVideo = item.mime_type.startsWith("video/");
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30" onClick={onClose}>
      <div className="bg-background rounded-xl p-4 flex flex-col gap-3 shadow-xl max-w-xs w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold truncate text-foreground">{item.name}</span>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
        </div>
        {isImage && (
          <img src={`${MEDIA_URL}/media/${item.id}/file`} alt={item.name}
            className="w-full rounded-lg border border-border object-contain max-h-48" />
        )}
        {isVideo && (
          <video src={`${MEDIA_URL}/media/${item.id}/file`} controls
            className="w-full rounded-lg border border-border max-h-48" />
        )}
        <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
          <span><strong className="text-foreground">{isImage ? "Image" : isVideo ? "Video" : "File"}</strong> · .{item.extension}</span>
          {item.width && item.height && <span>{item.width} × {item.height} px</span>}
          {item.duration && <span>{item.duration.toFixed(1)}s</span>}
          <span>{(item.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function MediaLibraryPanel({ onClose }: Props) {
  const [items, setItems]           = useState<MediaItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [cropSrc, setCropSrc]       = useState<string | null>(null);
  const [cropMode, setCropMode]     = useState<CropMode>("horizontal");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId]     = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [query, setQuery]           = useState("");
  const [editItem, setEditItem]     = useState<MediaItem | null>(null);
  const [editName, setEditName]     = useState("");
  const [editDesc, setEditDesc]     = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openEdit(item: MediaItem) {
    setEditItem(item);
    setEditName(item.title ?? "");
    setEditDesc(item.description ?? "");
  }

  async function saveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    try {
      const res  = await fetch(`${MEDIA_URL}/media/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editName, description: editDesc }),
      });
      const data = await res.json();
      if (data.ok) {
        setItems((prev) => prev.map((i) => i.id === editItem.id ? data.item : i));
        toast.success("File info updated");
        setEditItem(null);
      } else {
        toast.error("Failed to save");
      }
    } finally {
      setEditSaving(false);
    }
  }

  const filteredItems = query.trim()
    ? items
        .filter((i) => {
          const q = query.toLowerCase();
          const url = `${MEDIA_URL}/media/${i.id}/file`.toLowerCase();
          return i.name.toLowerCase().includes(q)
            || (i.title ?? "").toLowerCase().includes(q)
            || (i.description ?? "").toLowerCase().includes(q)
            || url.includes(q);
        })
        .sort((a, b) => {
          const q = query.toLowerCase();
          const aLabel = (a.title || a.name).toLowerCase();
          const bLabel = (b.title || b.name).toLowerCase();
          const aStart = aLabel.startsWith(q);
          const bStart = bLabel.startsWith(q);
          if (aStart && !bStart) return -1;
          if (!aStart && bStart) return 1;
          return aLabel.localeCompare(bLabel);
        })
    : items;

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    try {
      const res  = await fetch(`${MEDIA_URL}/media`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setError("Media service unavailable. Start: node services/media/server.js");
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setPendingFile(file);
      setCropSrc(URL.createObjectURL(file));
    } else {
      uploadFile(file, null);
    }
    e.target.value = "";
  }

  async function uploadFile(file: File, croppedBlob: Blob | null) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", croppedBlob ? new File([croppedBlob], file.name, { type: "image/jpeg" }) : file);
      fd.append("name", file.name);
      const res  = await fetch(`${MEDIA_URL}/media/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setItems((prev) => [data.item, ...prev]);
      toast.success(`"${data.item.name}" uploaded`);
    } catch (e) {
      toast.error(String(e));
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    const item = items.find((i) => i.id === id);
    try {
      await fetch(`${MEDIA_URL}/media/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(`"${item?.name ?? "File"}" deleted`);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(`${MEDIA_URL}/media/${item.id}/file`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("URL copied to clipboard");
  }

  return (
    <div style={{ position: "absolute", top: 52, left: 0, right: 0, bottom: 36, zIndex: 20 }}
      className="bg-background flex flex-col">

      {/* Cropper overlay */}
      {cropSrc && pendingFile && (
        <div style={{ position: "absolute", inset: 0, zIndex: 30 }} className="bg-background flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0">
            <span className="text-xs font-semibold text-foreground flex-1">Crop image</span>
            <div className="flex gap-1">
              {(["horizontal", "square", "vertical"] as CropMode[]).map((m) => (
                <button key={m} type="button" onClick={() => setCropMode(m)}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors ${cropMode === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                  {m === "horizontal" ? "16:9" : m === "square" ? "1:1" : "9:16"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <ImageCropper
              src={cropSrc}
              cropMode={cropMode}
              onDone={(blob) => { setCropSrc(null); uploadFile(pendingFile, blob); setPendingFile(null); }}
              onCancel={() => { setCropSrc(null); setPendingFile(null); }}
            />
          </div>
        </div>
      )}

      {/* Preview overlay */}
      {previewItem && <PreviewPopup item={previewItem} onClose={() => setPreviewItem(null)} />}

      {/* Edit overlay */}
      {editItem && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-background rounded-xl p-5 flex flex-col gap-3 shadow-xl mx-4 w-full max-w-xs">
            <span className="text-xs font-semibold text-foreground">Edit file info</span>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">Title</span>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                placeholder={editItem?.name ?? ""}
                className="h-7 rounded-md border border-border bg-muted px-2 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              <span className="text-[10px] text-muted-foreground/50 font-mono truncate">{editItem?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">Description</span>
              <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Optional"
                className="h-7 rounded-md border border-border bg-muted px-2 text-[11px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditItem(null)}
                className="text-[11px] px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button type="button" onClick={saveEdit} disabled={editSaving}
                className="text-[11px] px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                {editSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation overlay */}
      {deleteId && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="bg-background rounded-xl p-5 flex flex-col gap-4 shadow-xl mx-4">
            <span className="text-xs font-semibold text-foreground">Delete this file?</span>
            <span className="text-[11px] text-muted-foreground">This action cannot be undone.</span>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setDeleteId(null)}
                className="text-[11px] px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button type="button" onClick={() => handleDelete(deleteId)}
                className="text-[11px] px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center px-4 py-2.5 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-foreground flex-1">Media Library</span>
        <span className="text-[10px] text-muted-foreground">
          {query ? `${filteredItems.length} of ${items.length}` : `${items.length} file${items.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Search */}
      {!loading && !error && (
        <div className="px-4 py-2 border-b border-border shrink-0">
          <div className="flex items-center gap-2 h-7 rounded-md border border-border bg-muted px-2">
            <Search size={11} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, URL…"
              className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={10} />
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs gap-2">
          <Loader2 size={13} className="animate-spin" />Loading…
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-[11px] text-destructive text-center">{error}</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">
          {items.length === 0 && (
            <div className="flex items-center justify-center text-[11px] text-muted-foreground py-8">
              No files yet — upload your first media
            </div>
          )}
          {items.length > 0 && filteredItems.length === 0 && (
            <div className="flex items-center justify-center text-[11px] text-muted-foreground py-8">
              No files matching "{query}"
            </div>
          )}
          {filteredItems.map((item) => {
            const isImage = item.mime_type.startsWith("image/");
            return (
              <div key={item.id} className="flex items-center gap-2 h-8 px-1 rounded-md hover:bg-muted/50 transition-colors group">
                {isImage
                  ? <ImageIcon size={12} className="text-muted-foreground shrink-0" />
                  : <Film size={12} className="text-muted-foreground shrink-0" />
                }
                <span className="flex-1 text-[11px] truncate font-mono" title={item.name}>
                  {item.title || <span className="text-muted-foreground">{item.name}</span>}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">.{item.extension}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => setPreviewItem(item)}
                    title="Preview"
                    className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Eye size={11} />
                  </button>
                  <button type="button" onClick={() => openEdit(item)}
                    title="Edit name & description"
                    className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Pencil size={11} />
                  </button>
                  <button type="button" onClick={() => copyUrl(item)}
                    title="Copy URL"
                    className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    {copiedId === item.id ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                  </button>
                  <button type="button" onClick={() => setDeleteId(item.id)}
                    title="Delete"
                    className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between shrink-0">
        <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
          {uploading ? <><Loader2 size={11} className="animate-spin" />Uploading…</> : <><ImagePlus size={11} />Upload media</>}
        </button>
        <button type="button" onClick={onClose}
          className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md border border-border text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          Close media
        </button>
      </div>
    </div>
  );
}
