import { useMemo } from 'react'

interface IProps {
  data: any[]
}

function SheetTable({ data }: IProps) {
  const heads = useMemo(() => {
    if (data?.[0]) {
      return Object.keys(data[0])
    } else {
      return []
    }
  }, [data])

  return (
    <table>
      <thead>
        <tr>
          {heads.map((head: string, index: number) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, index: number) => {
          const columns = Object.values(row)
          return (
            <tr key={index}>
              {columns.map((column: any, index: number) => (
                <td key={index}>{column}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default SheetTable
