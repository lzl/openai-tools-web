import { useRef, useState } from 'react'
import { apiBaseUrl } from './const'
import emailRegex from './emailRegex'

interface IProps {
  filename: string
  disabled?: boolean
}

function GPTButton({ disabled, filename }: IProps) {
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [temperature, setTemperature] = useState(0.7)
  const apiKeyRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const systemMessageRef = useRef<HTMLTextAreaElement>(null)
  const userMessageRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit() {
    const apiKey = apiKeyRef.current?.value
    const email = emailRef.current?.value
    const systemMessage = systemMessageRef.current?.value
    const userMessage = userMessageRef.current?.value
    if (!apiKey || !email || !userMessage || !filename) return

    const isEmailValid = emailRegex().test(email)
    if (!isEmailValid) {
      alert('Please make sure the email address is valid')
    }

    const config = {
      model,
      temperature,
      systemMessage,
      userMessage,
    }
    const payload = { email, config, blob_name: filename }
    try {
      setLoading(true)
      const result = await fetch(`${apiBaseUrl}/ask_all_questions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + apiKey || '',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.json())
      if (result.success) {
        alert('Success! Please check your email.')
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.log('[GPTButton] ask_all_questions error:', error)
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="gpt-model">Model: {model}</label>
        <select
          id="gpt-model"
          onChange={(e) => {
            setModel(e.target.value)
          }}
        >
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
          <option value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</option>
          <option value="gpt-4">gpt-4</option>
          <option value="gpt-4-1106-preview">gpt-4-1106-preview</option>
        </select>

        <label htmlFor="temperature">Temperature: {temperature}</label>
        <input
          type="range"
          id="temperature"
          value={temperature}
          onChange={(e) => {
            setTemperature(Number(e.target.value))
          }}
          min="0"
          max="1"
          step="0.1"
        />

        <textarea
          ref={systemMessageRef}
          rows={3}
          placeholder="System Instruction: You are ChatGPT, a large language model trained by OpenAI."
        />

        <textarea
          ref={userMessageRef}
          rows={10}
          placeholder="User Prompt: {表头名称}"
        />
      </div>

      <div>
        <input
          type="email"
          ref={emailRef}
          placeholder="email"
          style={{ marginRight: '8px' }}
        />
        <input
          type="text"
          ref={apiKeyRef}
          placeholder="access code"
          style={{ marginRight: '8px' }}
        />
        <button onClick={handleSubmit} disabled={disabled || loading}>
          {loading ? 'Running...' : 'Run!'}
        </button>
      </div>
    </div>
  )
}

export default GPTButton
