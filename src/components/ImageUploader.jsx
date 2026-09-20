import { useState, useRef } from 'react'
import { UploadCloud, Image, CheckCircle2, AlertCircle, X, Key, ExternalLink, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../lib/api'

export default function ImageUploader({ value, onChange, label = 'Project Image' }) {
  const [uploading, setUploading] = useState(false)
  const [showManualUrl, setShowManualUrl] = useState(!value)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('imgbb_api_key') || '')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleSaveKey = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem('imgbb_api_key', apiKey.trim())
      setShowKeyInput(false)
      toast.success('ImgBB API Key saved!')
    }
  }

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.')
      return
    }

    setUploading(true)
    const reader = new FileReader()

    reader.onload = async () => {
      try {
        const base64Data = reader.result
        const keyToUse = apiKey || localStorage.getItem('imgbb_api_key') || ''
        const result = await api.upload.image(base64Data, keyToUse)

        if (result.url) {
          onChange(result.url)
          toast.success('Image uploaded to ImgBB successfully! 🚀')
        }
      } catch (err) {
        console.error('ImgBB upload error:', err)
        if (err.message?.includes('API key is missing') || err.message?.includes('key')) {
          setShowKeyInput(true)
          toast.error('ImgBB API key required. Please enter your key below.')
        } else {
          toast.error(err.message || 'Failed to upload image to ImgBB')
        }
      } finally {
        setUploading(false)
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
      setUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs text-slate-400 font-medium">
          {label} (File upload via ImgBB)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <Key size={12} />
            {apiKey ? 'Change ImgBB Key' : 'Set ImgBB Key'}
          </button>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            {showManualUrl ? 'Hide manual URL' : 'Or paste URL'}
          </button>
        </div>
      </div>

      {/* API Key Modal / Dropdown */}
      {showKeyInput && (
        <div className="card-glow p-3 rounded-xl border border-indigo-500/30 bg-dark-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5 text-indigo-300">
              <Key size={13} /> ImgBB API Key
            </span>
            <a
              href="https://api.imgbb.com/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              Get Free Key <ExternalLink size={10} />
            </a>
          </div>
          <p className="text-[11px] text-slate-400">
            Enter your free ImgBB API key from api.imgbb.com. It will be saved locally and used for all uploads.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. 8a3f5c9e2b1d0..."
              className="input-field text-xs py-1.5 flex-1"
            />
            <button
              type="button"
              onClick={handleSaveKey}
              className="btn-primary py-1.5 px-3 text-xs cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* File Dropzone & Current Image Preview */}
      <div className="grid sm:grid-cols-2 gap-3 items-start">
        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[120px] ${
            dragOver
              ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
              : 'border-white/10 hover:border-indigo-500/40 bg-dark-800/40 hover:bg-dark-800/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 size={24} className="text-indigo-400 animate-spin" />
              <p className="text-xs text-indigo-300 font-medium">Uploading to ImgBB...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
                <UploadCloud size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-200">
                Click to upload or drag & drop
              </p>
              <p className="text-[11px] text-slate-500">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          )}
        </div>

        {/* Current / Preview Image Display */}
        <div className="relative rounded-xl border border-white/10 bg-dark-800/40 min-h-[120px] flex items-center justify-center overflow-hidden">
          {value ? (
            <div className="relative w-full h-[120px] group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
                >
                  <ExternalLink size={13} /> View
                </a>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange('') }}
                  className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-200 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} /> Remove
                </button>
              </div>
              <div className="absolute bottom-1 left-2 right-2 flex items-center gap-1 text-[10px] text-emerald-400 font-mono truncate bg-dark-900/80 px-1.5 py-0.5 rounded">
                <CheckCircle2 size={10} className="flex-shrink-0" />
                <span className="truncate">{value}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-500 py-4">
              <Image size={24} className="opacity-40" />
              <span className="text-xs">No image chosen</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual URL input option */}
      {showManualUrl && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://i.ibb.co/example.png or direct image link..."
            className="input-field text-xs"
          />
        </div>
      )}
    </div>
  )
}
