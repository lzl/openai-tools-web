const example = "{{表头名称}}"

interface IProps {
  value: string
  onChange: (value: string) => void
}

function PromptInput({ value, onChange }: IProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
  }

  return (
    <div>
      <pre>示例：{example}</pre>
      <textarea value={value} onChange={handleChange} rows={10} placeholder="prompt" />
    </div>
  )
}

export default PromptInput;
