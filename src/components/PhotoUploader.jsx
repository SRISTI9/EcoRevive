
import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react'

const MAX_FILES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function PhotoUploader({ onPhotosChange }) {
  const [photos, setPhotos] = useState([])
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const photosRef = useRef([])

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url))
    }
  }, [])

  function updatePhotos(nextPhotos) {
    photosRef.current = nextPhotos
    setPhotos(nextPhotos)
    onPhotosChange?.(nextPhotos.map((photo) => photo.file))
  }

  function addFiles(fileList) {
    setError('')

    const selectedFiles = Array.from(fileList || [])
    const currentPhotos = photosRef.current
    const remainingSlots = MAX_FILES - currentPhotos.length

    if (remainingSlots <= 0) {
      setError(`You can upload a maximum of ${MAX_FILES} images.`)
      return
    }

    const accepted = []
    const errors = []

    for (const file of selectedFiles) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: use JPG, PNG or WEBP.`)
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: maximum file size is 5 MB.`)
        continue
      }

      if (currentPhotos.length + accepted.length >= MAX_FILES) {
        errors.push(`Only ${MAX_FILES} images can be uploaded.`)
        break
      }

      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      })
    }

    const nextPhotos = [...currentPhotos, ...accepted]
    updatePhotos(nextPhotos)

    if (errors.length) {
      setError(errors.join(' '))
    }

    // Allow selecting the same file again after removing it.
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  function removePhoto(id) {
    const photo = photosRef.current.find((item) => item.id === id)

    if (photo) {
      URL.revokeObjectURL(photo.url)
    }

    updatePhotos(photosRef.current.filter((item) => item.id !== id))
    setError('')
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragging(false)
          }
        }}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition sm:p-10 ${
          dragging
            ? 'border-emerald-600 bg-emerald-50'
            : 'border-gray-200 bg-gray-50 hover:border-emerald-400'
        }`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
          <UploadCloud size={28} />
        </div>

        <h4 className="font-semibold text-gray-900">
          Drag and drop your device photos
        </h4>

        <p className="mt-2 text-sm text-gray-500">
          Or select images from your device
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={photos.length >= MAX_FILES}
          className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-50"
        >
          Browse images
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        <p className="mt-4 text-xs text-gray-500">
          JPG, PNG or WEBP · Maximum 5 MB each · Up to 5 images
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">
              Selected photos ({photos.length}/{MAX_FILES})
            </h4>
            <button
              type="button"
              onClick={() => {
                photosRef.current.forEach((photo) =>
                  URL.revokeObjectURL(photo.url),
                )
                updatePhotos([])
                setError('')
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Remove all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={photo.url}
                    alt={`Preview of ${photo.file.name}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={`Remove ${photo.file.name}`}
                    className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-gray-700 shadow hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-3">
                  <ImageIcon
                    size={15}
                    className="mb-1 text-emerald-700"
                  />
                  <p className="truncate text-xs font-medium text-gray-700">
                    {photo.file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {(photo.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Photos are currently previewed locally in your browser. They are not
        uploaded to a server or analyzed by an AI model yet. Later, this
        component can send images to the EcoRevive image-assessment API.
      </p>
    </div>
  )
}
