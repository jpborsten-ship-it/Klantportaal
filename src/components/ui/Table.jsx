export default function Table({ columns, rows, getRowKey, onRowClick, emptyMessage = 'Geen gegevens.' }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.headerContent ? col.headerContent() : col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="table-empty">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'table-row--clickable' : ''}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
