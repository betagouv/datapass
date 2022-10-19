import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  Column,
  TableOptions,
  RowData,
  getFacetedUniqueValues,
} from '@tanstack/react-table';
import MultiSelect from '../../molecules/MultiSelect';
import Input from '../inputs/Input';
import TablePagination from '../TablePagination';
import './style.css';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    placeholder?: string;
    filterType?: 'text' | 'select';
  }
}

interface onRowClickProps {
  event: React.MouseEvent<HTMLElement>;
  row: RowData;
}

const Table = ({
  tableOptions,
  firstColumnFixed = false,
  onRowClick,
}: {
  tableOptions: TableOptions<RowData>;
  firstColumnFixed?: boolean;
  onRowClick?: (onRowClickProps: onRowClickProps) => void;
}) => {
  const table = useReactTable({
    ...tableOptions,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
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
                            <FilterComponent column={header.column} />
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
              <tr
                key={row.id}
                onClick={
                  onRowClick ? (e) => onRowClick({ event: e, row }) : () => null
                }
                className={onRowClick ? 'clickable-row' : ''}
              >
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

const FilterComponent = ({ column }: { column: Column<any, any> }) => {
  const columnFilterValue = column.getFilterValue();
  const { meta } = column.columnDef;
  const options = Array.from(column.getFacetedUniqueValues().keys()).map(
    (value, i) => ({ key: value, label: value })
  );
  switch (meta?.filterType) {
    case 'select':
      return (
        <MultiSelect
          options={options}
          values={(columnFilterValue ?? []) as Array<any>}
          onChange={column.setFilterValue}
        />
      );

    default:
      return (
        <Input
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={(e: React.SyntheticEvent) => {
            const target = e.target as HTMLInputElement;
            column.setFilterValue(target.value);
          }}
          icon="filter"
          placeholder={meta?.placeholder}
        />
      );
  }
};

export default Table;
