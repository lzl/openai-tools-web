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

const URL = 'http://127.0.0.1:5000/chat_completions'

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

async function fetchAnswer() {
  const payload = createPayload([{ role: 'user', content: 'hi' }])
  return fetch(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json())
}

interface IProps {
  data: any[]
  onSuccess: (idx: number, answer: string) => void
}

function GPTButton({ data, onSuccess }: IProps) {
  async function handleSubmit() {
    const queue = new RequestQueue()
    data.forEach((row, idx) => {
      queue.add(fetchAnswer, (answer) => onSuccess(idx, answer))
    })
  }

  return <button onClick={handleSubmit}>Run!</button>
}

export default GPTButton
