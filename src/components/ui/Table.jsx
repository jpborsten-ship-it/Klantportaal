export default function Table({ columns, rows, getRowKey, onRowClick, emptyMessage = 'Geen gegevens.' }) {
  if (rows.length === 0) {
    return <p className="table-empty">{emptyMessage}</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={getRowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={onRowClick ? 'table-row--clickable' : ''}
          >
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
