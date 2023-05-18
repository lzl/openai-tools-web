import { useRef, useState } from 'react'
import { apiBaseUrl } from './const'

class RequestQueue {
  constructor(maxCount: number) {
    this.maxCount = maxCount
  }

  private queue: {
    request: () => Promise<any>
    onSuccess: (answer: string) => void
    onFinish: () => void
  }[] = []
  private count = 0
  private maxCount = 5

  getCount() {
    return this.count
  }

  add(
    request: () => Promise<any>,
    onSuccess: (answer: string) => void,
    onFinish: () => void
  ) {
    this.queue.push({ request, onSuccess, onFinish })
    this.next()
  }

  private next() {
    if (this.count >= this.maxCount || this.queue.length === 0) {
      return
    }
    const { request, onSuccess, onFinish } = this.queue.shift() || {}
    this.count++
    request?.()
      .then((res) => {
        onSuccess?.(res)
      })
      .catch((err) => {
        console.log('[RequestQueue] request error:', err)
      })
      .finally(() => {
        this.count--
        this.next()
        if (this.count === 0) {
          onFinish?.()
        }
      })
  }
}

interface IMessage {
  role: 'system' | 'assistant' | 'user'
  content: string
}

const systemMessage: IMessage = {
  role: 'system',
  content: 'You are ChatGPT, a large language model trained by OpenAI.',
}

function createPayload(messages: IMessage[], config?: any) {
  return {
    messages: [systemMessage, ...messages],
    model: 'gpt-3.5-turbo',
    ...config,
  }
}

async function fetchAnswer(
  content: string,
  apiKey: string,
  model: string,
  temperature: number
) {
  const payload = createPayload([{ role: 'user', content }], {
    model,
    temperature,
  })
  return fetch(`${apiBaseUrl}/chat_completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + apiKey || '',
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json())
}

interface IProps {
  prompt: string
  data: any[]
  onSuccess: (idx: number, answer: string) => void
  disabled?: boolean
}

function GPTButton({ prompt, data, onSuccess, disabled }: IProps) {
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo')
  const [temperature, setTemperature] = useState(0.7)
  const [maxConcurrency, setMaxConcurrency] = useState(5)
  const apiKeyRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    const apiKey = apiKeyRef.current?.value
    if (!apiKey) return
    setLoading(true)
    const queue = new RequestQueue(maxConcurrency)
    data.forEach((row, idx) => {
      // const hasAnswer = !!row.answer
      // if (hasAnswer) return;
      let p = prompt.trim()
      const keys = Object.keys(row)
      keys.forEach((key) => {
        p = p.replaceAll(`{{${key}}}`, row[key])
      })
      queue.add(
        () => fetchAnswer(p, apiKey, model, temperature),
        (answer) => onSuccess(idx, answer),
        () => setLoading(false)
      )
    })
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

        <label htmlFor="maxConcurrency">
          Max Concurrency: {maxConcurrency}
        </label>
        <input
          type="range"
          id="maxConcurrency"
          value={maxConcurrency}
          onChange={(e) => {
            setMaxConcurrency(Number(e.target.value))
          }}
          min="1"
          max="50"
          step="1"
        />
      </div>

      <div>
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
