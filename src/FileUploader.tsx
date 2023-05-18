import { useState } from 'react'
import { apiBaseUrl } from './const'

interface IProps {
  onSuccess: (json: any[]) => void
}

function FileUploader({ onSuccess }: IProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      (file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      setSelectedFile(file)
    } else {
      alert('Please select an xlsx file.')
    }
  }

  const handleUploadFile = async () => {
    try {
      if (selectedFile) {
        setLoading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)
        // Upload formData to server
        const response = await fetch(`${apiBaseUrl}/parse_excel`, {
          method: 'POST',
          body: formData,
        })
        let json = await response.json()
        if (typeof json === 'string') json = JSON.parse(json)
        onSuccess(json)
      } else {
        alert('Please select a file to upload.')
      }
    } catch (error: any) {
      setError(`Failed: ${error.message}`)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx" />
      <button onClick={handleUploadFile} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default FileUploader
