import { useRef } from 'react'
import { apiBaseUrl } from './const'

class RequestQueue {
  private queue: {
    request: () => Promise<any>
    onSuccess: (answer: string) => void
  }[] = []
  private count = 0
  private maxCount = 5

  add(request: () => Promise<any>, onSuccess: (answer: string) => void) {
    this.queue.push({ request, onSuccess })
    this.next()
  }

  private next() {
    if (this.count >= this.maxCount || this.queue.length === 0) {
      return
    }
    const { request, onSuccess } = this.queue.shift() || {}
    this.count++
    request?.()
      .then((res) => {
        onSuccess?.(res)
        this.count--
        this.next()
      })
      .catch(() => {
        this.count--
        this.next()
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

function createPayload(messages: IMessage[]) {
  return {
    messages: [systemMessage, ...messages],
    model: 'gpt-3.5-turbo',
  }
}

async function fetchAnswer(content: string, apiKey: string) {
  const payload = createPayload([{ role: 'user', content }])
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
  const apiKeyRef = useRef<HTMLInputElement>(null)

  async function handleSubmit() {
    const apiKey = apiKeyRef.current?.value
    if (!apiKey) return
    const queue = new RequestQueue()
    data.forEach((row, idx) => {
      // const hasAnswer = !!row.answer
      // if (hasAnswer) return;
      let p = prompt.trim()
      const keys = Object.keys(row)
      keys.forEach((key) => {
        p = p.replaceAll(`{{${key}}}`, row[key])
      })
      queue.add(
        () => fetchAnswer(p, apiKey),
        (answer) => onSuccess(idx, answer)
      )
    })
  }

  return (
    <div>
      <input type="text" ref={apiKeyRef} placeholder="access code" />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        style={{ marginLeft: '8px' }}
      >
        Run!
      </button>
    </div>
  )
}

export default GPTButton
