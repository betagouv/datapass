// 👇️ ts-nocheck ignores all ts errors in the file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Input from '../inputs/Input';
import TablePagination from '../TablePagination';
import './style.css';

export default function Table({ columns, data, autoResetAll, updateData }) {
  const table = useReactTable({
    data,
    columns,
    autoResetAll,
    onStateChange: updateData,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="datapass-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanFilter() ? (
                        <div>
                          <TextFilterInput column={header.column} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <TablePagination table={table} />
    </>
  );
}

function TextFilterInput({ column }) {
  const columnFilterValue = column.getFilterValue();
  return (
    <Input
      type="text"
      value={columnFilterValue}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={column.columnDef.placeholder}
    />
  );
}
