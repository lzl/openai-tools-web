import { useState } from 'react'

const URL = 'http://127.0.0.1:5000/parse_excel'

interface IProps {
  onSuccess: (json: any[]) => void
}

function FileUploader({ onSuccess }: IProps) {
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
        const formData = new FormData()
        formData.append('file', selectedFile)
        // Upload formData to server
        const response = await fetch(URL, {
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
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx" />
      <button onClick={handleUploadFile}>Upload</button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default FileUploader
