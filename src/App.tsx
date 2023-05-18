import { useState } from 'react'
import useSheetData from './useSheetData'
import FileUploader from './FileUploader'
import SheetTable from './SheetTable'
import GPTButton from './GPTButton'
import PromptInput from './PromptInput'
import SheetDownloader from './SheetDownloader'

function App() {
  const { data, setData, setAnswer } = useSheetData()
  const [prompt, setPrompt] = useState('')

  const isShowButton = !!prompt && !!data?.length

  return (
    <main>
      <PromptInput value={prompt} onChange={setPrompt} />
      {isShowButton && (
        <GPTButton prompt={prompt} data={data} onSuccess={setAnswer} />
      )}
      <FileUploader onSuccess={setData} />
      {isShowButton && <SheetDownloader data={data} />}
      <SheetTable data={data} />
    </main>
  )
}

export default App
