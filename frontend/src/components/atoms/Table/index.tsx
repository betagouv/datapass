import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
  TableOptions,
  RowData,
  getFacetedUniqueValues,
  getSortedRowModel,
  getFilteredRowModel,
  Row,
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
    selectOptions?: any[];
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
  getRowClassName,
  wrapperClassName = '',
}: {
  tableOptions: TableOptions<RowData>;
  firstColumnFixed?: boolean;
  onRowClick?: (onRowClickProps: onRowClickProps) => void;
  getRowClassName?: (row: Row<RowData>) => string;
  wrapperClassName?: string;
}) => {
  const table = useReactTable({
    ...tableOptions,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  let tableClassName = 'datapass-table';

  if (firstColumnFixed) {
    tableClassName += ' firstColumnFixed';
  }

  const getSortingHeaderProps = (column: Column<any, any>) => {
    if (column.getCanSort()) {
      return {
        className: 'sorting-header',
        onClick: column.getToggleSortingHandler(),
      };
    }

    return {};
  };

  const rowClassName = (row: Row<RowData>) => {
    let className = '';

    if (onRowClick) {
      className += 'clickable-row';
    }

    if (getRowClassName) {
      className += ' ' + getRowClassName(row);
    }

    return className;
  };

  return (
    <>
      <div className={`page-container ${wrapperClassName}`}>
        <table className={tableClassName}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div {...getSortingHeaderProps(header.column)}>
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
                className={rowClassName(row)}
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
  const defaultOptions = Array.from(column.getFacetedUniqueValues().keys()).map(
    (value, i) => ({ key: value, label: value })
  );
  switch (meta?.filterType) {
    case 'select':
      return (
        <MultiSelect
          options={meta.selectOptions ? meta.selectOptions : defaultOptions}
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
