import { useCallback, useEffect, useState } from 'react'
import { produce } from 'immer'
import { maxRows } from './const'

function useSheetData() {
  const [data, setData] = useState<any[]>([])
  const [filename, setFilename] = useState<string>('')

  const setDataLimit = useCallback((json: any) => {
    console.log('json:', json)
    const { blob_name, json_data } = json;
    setFilename(blob_name)
    setData(JSON.parse(json_data).slice(0, maxRows))
  }, [])

  const setAnswer = useCallback((idx: number, response: any) => {
    setData(
      produce((draft: any) => {
        const answer = response?.choices?.[0]?.message?.content
        if (answer) draft[idx].answer = answer
      })
    )
  }, [])

  useEffect(() => {
    console.log('[useSheetData] data:', data)
  }, [data])

  return {
    data,
    setData: setDataLimit,
    setAnswer,
    filename
  }
}

export default useSheetData
