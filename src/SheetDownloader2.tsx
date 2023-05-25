import { useRef, useState } from 'react'
import { apiBaseUrl } from './const'

function SheetDownloader() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const requestIdRef = useRef<HTMLInputElement>(null)

  function handleDownload() {
    setIsDownloading(true)
    const requestId = requestIdRef.current?.value
    if (!requestId) return
    return fetch(`${apiBaseUrl}/generate_excel`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ request_id: requestId }),
    })
      .then((response) => {
        // 处理响应
        if (response.ok) {
          // 将文件作为 Blob 对象读取并创建 URL
          return response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob)

            // 创建一个链接元素并模拟点击从而下载文件
            const a = document.createElement('a')
            a.href = url
            a.download = 'output.xlsx'
            a.click()

            // 释放 URL 对象
            window.URL.revokeObjectURL(url)
          })
        } else {
          console.log(`Request failed with status ${response.status}`)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error: ' + error.message)
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  function handleSend() {
    setIsSending(true)
    const requestId = requestIdRef.current?.value
    if (!requestId) return
    return fetch(`${apiBaseUrl}/send_answers_email`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ request_id: requestId }),
    })
      .catch((error) => {
        console.error('Error:', error)
        alert('Error: ' + error.message)
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <>
      <input
        type="text"
        ref={requestIdRef}
        placeholder="request_id"
        style={{ marginRight: '8px' }}
      />
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        style={{ marginRight: '8px' }}
      >
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
    </>
  )
}

export default SheetDownloader
