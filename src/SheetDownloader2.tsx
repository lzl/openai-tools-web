import { useRef, useState } from 'react'
import { apiBaseUrlServer } from './const'

function SheetDownloader() {
  const [loading, setLoading] = useState(false)
  const requestIdRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    setLoading(true)
    const requestId = requestIdRef.current?.value
    if (!requestId) return
    return fetch(`${apiBaseUrlServer}/send_answers_email`, {
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
        setLoading(false)
      })
  }

  return (
    <>
      <input type="text" ref={requestIdRef} placeholder="request_id" style={{ marginRight: '8px' }} />
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Sending...' : 'Send Email'}
      </button>
    </>
  )
}

export default SheetDownloader
