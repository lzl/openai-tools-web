import { useCallback, useEffect, useState } from 'react'
import { produce } from 'immer'
import { maxRows } from './const'

function useSheetData() {
  const [data, setData] = useState<any[]>([])

  const setDataLimit = useCallback((json: any[]) => {
    setData(json.slice(0, maxRows))
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
  }
}

export default useSheetData
