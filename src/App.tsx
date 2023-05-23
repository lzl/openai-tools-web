import { useState } from 'react'
import useSheetData from './useSheetData'
import FileUploader from './FileUploader'
import SheetTable from './SheetTable'
import GPTButton from './GPTButton'
import PromptInput from './PromptInput'
import SheetDownloader from './SheetDownloader'
import GPTButton2 from './GPTButton2'
import SheetDownloader2 from './SheetDownloader2'

function App() {
  const { data, setData } = useSheetData()
  const [prompt, setPrompt] = useState('')

  const isShowButton = !!prompt && !!data?.length

  return (
    <div>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <PromptInput value={prompt} onChange={setPrompt} />
        {/* {isShowButton && (
          <GPTButton prompt={prompt} data={data} onSuccess={setAnswer} />
        )} */}
        {isShowButton && (
          <GPTButton2 prompt={prompt} data={data} />
        )}
        <FileUploader onSuccess={setData} />
        {/* {isShowButton && <SheetDownloader data={data} />} */}
        {isShowButton && <SheetDownloader2 />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SheetTable data={data} />
      </div>
    </div>
  )
}

export default App
