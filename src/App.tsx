import { useState } from 'react'
import FileUploader from './FileUploader'
import SheetTable from './SheetTable'

function App() {
  const [sheetData, setSheetData] = useState<any>([])

  function handleSuccess(json: any[]) {
    setSheetData(json)
  }

  return (
    <div>
      <FileUploader onSuccess={handleSuccess} />
      <SheetTable data={sheetData} />
    </div>
  )
}

export default App
