import useSheetData from './useSheetData'
import FileUploader from './FileUploader'
import SheetTable from './SheetTable'
import GPTButton2 from './GPTButton2'
import SheetDownloader2 from './SheetDownloader2'

function App() {
  const { data, setData, filename } = useSheetData()

  const isShowButton = !!data?.length

  return (
    <div>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <FileUploader onSuccess={setData} />
        {isShowButton && <GPTButton2 filename={filename} />}
      </div>
      {isShowButton && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SheetTable data={data} />
        </div>
      )}
      <hr />
      <div style={{ maxWidth: 600, margin: 'auto', marginTop: 24 }}>
        <SheetDownloader2 />
      </div>
    </div>
  )
}

export default App
