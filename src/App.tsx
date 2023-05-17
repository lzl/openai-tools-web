import useSheetData from './useSheetData'
import FileUploader from './FileUploader'
import SheetTable from './SheetTable'
import GPTButton from './GPTButton'

function App() {
  const { data, setData, setAnswer } = useSheetData()

  return (
    <div>
      <FileUploader onSuccess={setData} />
      <SheetTable data={data} />
      <GPTButton data={data} onSuccess={setAnswer} />
    </div>
  )
}

export default App
