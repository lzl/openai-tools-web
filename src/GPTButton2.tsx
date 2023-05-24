import { useRef, useState } from 'react'
import { apiBaseUrlServer } from './const'
import { nanoid } from 'nanoid'

interface IProps {
  data: any[]
  disabled?: boolean
}

function GPTButton({ data, disabled }: IProps) {
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
    if (!apiKey || !email || !userMessage) return
    const sheets = data.map((row) => ({
      id: nanoid(),
      row,
    }))
    const questions = sheets.map(({ id, row }) => {
      let text = userMessage.trim()
      const keys = Object.keys(row)
      keys.forEach((key) => {
        text = text.replaceAll(`{${key}}`, row[key])
      })
      return {
        id,
        text,
      }
    })
    const config = {
      model,
      temperature,
      systemMessage,
    }
    const payload = { email, config, sheets, questions }
    try {
      setLoading(true)
      await fetch(`${apiBaseUrlServer}/ask_all_questions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: 'Bearer ' + apiKey || '',
        },
        body: JSON.stringify(payload),
      })
      alert('Success! Please check your email.')
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
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
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

        <textarea ref={userMessageRef} rows={10} placeholder="User Prompt: {表头名称}" />
      </div>

      <div>
        <input type="email" ref={emailRef} placeholder="email" style={{ marginRight: '8px' }} />
        <input type="text" ref={apiKeyRef} placeholder="access code" style={{ marginRight: '8px' }} />
        <button
          onClick={handleSubmit}
          disabled={disabled || loading}
        >
          {loading ? 'Running...' : 'Run!'}
        </button>
      </div>
    </div>
  )
}

export default GPTButton
