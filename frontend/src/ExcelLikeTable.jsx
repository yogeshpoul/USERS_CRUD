import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ExcelLikeTable = () => {
  const [columns, setColumns] = useState(['First Name', 'Last Name', 'Phone', 'Email', 'Address']);
  const [rows, setRows] = useState([
    { id: uuidv4(), data: ['', '', '', '', ''] },
  ]);

  const handleCellChange = (rowId, colIndex, value) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        const updatedRow = [...row.data];
        updatedRow[colIndex] = value;
        return { ...row, data: updatedRow };
      }
      return row;
    }));
  };

  const addRow = () => {
    const newRow = { id: uuidv4(), data: new Array(columns.length).fill('') };
    setRows([...rows, newRow]);
  };

  const addColumn = () => {
    const newColumn = prompt('Enter column name');
    if (newColumn) {
      setColumns([...columns, newColumn]);
      setRows(rows.map(row => ({ ...row, data: [...row.data, ''] })));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Details (Excel-like Table)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="border px-4 py-2 bg-gray-100 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.data.map((cellData, colIndex) => (
                  <td key={colIndex} className="border px-4 py-2">
                    <input
                      type="text"
                      value={cellData}
                      onChange={(e) => handleCellChange(row.id, colIndex, e.target.value)}
                      className="w-full px-2 py-1 border rounded focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          onClick={addRow}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Column
        </button>
      </div>
    </div>
  );
};

export default ExcelLikeTable;
