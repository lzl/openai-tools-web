import { useState } from 'react'
import { apiBaseUrl } from './const'

interface IProps {
  data: any[]
}

function SheetDownloader({ data }: IProps) {
  const [loading, setLoading] = useState(false)

  function handleClick() {
    setLoading(true)
    return fetch(`${apiBaseUrl}/generate_excel`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
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
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      Download
    </button>
  )
}

export default SheetDownloader
