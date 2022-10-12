import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Column,
  TableOptions,
  RowData,
} from '@tanstack/react-table';
import Input from '../inputs/Input';
import TablePagination from '../TablePagination';
import './style.css';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    placeholder: string;
  }
}

const Table = ({
  tableOptions,
  firstColumnFixed = false,
}: {
  tableOptions: TableOptions<RowData>;
  firstColumnFixed?: boolean;
}) => {
  const table = useReactTable({
    ...tableOptions,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  let tableClassName = 'datapass-table';

  if (firstColumnFixed) {
    tableClassName += ' firstColumnFixed';
  }

  return (
    <>
      <div className="datapass-table-wrapper page-container">
        <table className={tableClassName}>
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
      </div>

      <TablePagination table={table} />
    </>
  );
};

const TextFilterInput = ({ column }: { column: Column<any, any> }) => {
  const columnFilterValue: any = column.getFilterValue();

  return (
    <Input
      type="text"
      value={columnFilterValue}
      onChange={(e: any) => column.setFilterValue(e.target.value)}
      placeholder={column.columnDef.meta?.placeholder}
    />
  );
};

export default Table;
