"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X, FileText, Film, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { ImageCropper, type CropMode } from "./image-cropper.client"
import { uploadFile, type UploadedFile } from "./upload.service"

type Accept = "image" | "video" | "document" | "any"

type Props = {
  accept?: Accept
  onUpload: (file: UploadedFile) => void
  label?: string
  /** Show a preview thumbnail after upload (images only) */
  preview?: boolean
}

const ACCEPT_MAP: Record<Accept, string> = {
  image:    "image/*",
  video:    "video/*",
  document: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.html,.htm",
  any:      "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.html,.htm",
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <ImageIcon size={14} className="text-muted-foreground" />
  if (mimeType.startsWith("video/")) return <Film size={14} className="text-muted-foreground" />
  return <FileText size={14} className="text-muted-foreground" />
}

export function FileUploadField({ accept = "any", onUpload, label = "Upload file", preview = false }: Props) {
  const [uploading, setUploading]     = useState(false)
  const [cropSrc, setCropSrc]         = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploaded, setUploaded]       = useState<UploadedFile | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type.startsWith("image/")) {
      setPendingFile(file)
      setCropSrc(URL.createObjectURL(file))
    } else {
      handleUpload(file, null)
    }
    e.target.value = ""
  }

  async function handleUpload(file: File, croppedBlob: Blob | null, cropMode?: CropMode) {
    setUploading(true)
    try {
      const result = await uploadFile(file, croppedBlob ? { croppedBlob, cropMode } : {})
      setUploaded(result)
      onUpload(result)
      toast.success(`"${result.name}" uploaded`)
    } catch (e) {
      toast.error(String(e))
    } finally {
      setUploading(false)
    }
  }

  function clear() {
    setUploaded(null)
    setCropSrc(null)
    setPendingFile(null)
  }

  return (
    <div className="relative">
      {cropSrc && pendingFile && (
        <ImageCropper
          src={cropSrc}
          onDone={(blob, cropMode) => { setCropSrc(null); handleUpload(pendingFile, blob, cropMode); setPendingFile(null) }}
          onCancel={() => { setCropSrc(null); setPendingFile(null) }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={handleSelect}
      />

      {!uploaded ? (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {uploading
            ? <><Loader2 size={12} className="animate-spin" />Uploading…</>
            : <><Upload size={12} />{label}</>
          }
        </button>
      ) : (
        <div className="flex items-center gap-2 h-8 px-2 rounded-md border border-border bg-muted/40 text-[11px]">
          <FileIcon mimeType={uploaded.mime_type} />
          {preview && uploaded.mime_type.startsWith("image/") && (
            <img src={uploaded.url} alt={uploaded.name} className="h-5 w-5 rounded object-cover border border-border" />
          )}
          <span className="font-mono text-foreground truncate max-w-[160px]">{uploaded.name}</span>
          <button type="button" onClick={clear} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <X size={11} />
          </button>
        </div>
      )}
    </div>
  )
}
