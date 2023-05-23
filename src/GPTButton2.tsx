import { useRef, useState } from 'react'
import { apiBaseUrlServer } from './const'
import { nanoid } from 'nanoid'

interface IProps {
  prompt: string
  data: any[]
  disabled?: boolean
}

function GPTButton({ prompt, data, disabled }: IProps) {
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [temperature, setTemperature] = useState(0.7)
  const apiKeyRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const systemMessageRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit() {
    const apiKey = apiKeyRef.current?.value
    const email = emailRef.current?.value
    const systemMessage = systemMessageRef.current?.value
    if (!apiKey || !email) return
    const sheets = data.map((row) => ({
      id: nanoid(),
      row,
    }))
    const questions = sheets.map(({ id, row }) => {
      let text = prompt.trim()
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
    } catch (error) {
      console.log('[GPTButton] ask_all_questions error:', error)
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
      </div>

      <div>
        <input type="email" ref={emailRef} placeholder="email" />
        <input type="text" ref={apiKeyRef} placeholder="access code" />
        <button
          onClick={handleSubmit}
          disabled={disabled || loading}
          style={{ marginLeft: '8px' }}
        >
          {loading ? 'Running...' : 'Run!'}
        </button>
      </div>
    </div>
  )
}

export default GPTButton
