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
import { CSSProperties, MouseEvent, SyntheticEvent } from 'react';
import TablePagination from '../../molecules/TablePagination';
import './style.css';
import FilterComponent from '../../molecules/FilterComponent';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    placeholder?: string;
    filterType?: 'text' | 'select';
    selectOptions?: any[];
  }
}

type onRowClickProps = {
  event: MouseEvent;
  row: any;
};

const Table = ({
  tableOptions,
  firstColumnFixed = false,
  onRowClick,
  getRowClassName,
  wrapperStyle,
  noDataPlaceholder = 'Aucune donnée',
  loading = false,
}: {
  tableOptions: TableOptions<RowData>;
  firstColumnFixed?: boolean;
  onRowClick?: (onRowClickProps: onRowClickProps) => void;
  getRowClassName?: (row: any) => string;
  wrapperStyle?: CSSProperties;
  noDataPlaceholder?: string;
  loading?: boolean;
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
        onClick: getOnSortingChange(
          column.getToggleSortingHandler() as (event: SyntheticEvent) => void
        ),
      };
    }

    return {};
  };

  const getOnSortingChange =
    (toggleSortingHandler: (event: SyntheticEvent) => void) =>
    (event: SyntheticEvent) => {
      toggleSortingHandler(event);
      table.setPageIndex(0);
    };

  const getOnFilterChange =
    (setFilterValue: (updater: any) => void) => (updater: any) => {
      setFilterValue(updater);
      table.setPageIndex(0);
    };

  const rowClassName = (row: Row<RowData>) => {
    let className = '';

    if (onRowClick) {
      className += 'clickable-row';
    }

    if (getRowClassName) {
      className += ' ' + getRowClassName(row.original);
    }

    return className;
  };

  const getNoDataRows = () => {
    const generatedArray = Array.from(Array(2).keys());

    return generatedArray.map((i) => (
      <tr key={i}>
        {table.getAllColumns().map((column) => (
          <td key={column.columnDef.id}></td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <div
        className="page-container datapass-table-wrapper"
        style={wrapperStyle}
      >
        {loading && <div className="datapass-table-loader">Chargement...</div>}
        {!table.getRowModel().rows.length && (
          <div className="datapass-table-placeholder">{noDataPlaceholder}</div>
        )}

        <table className={tableClassName}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const defaultOptions = Array.from(
                    header.column.getFacetedUniqueValues().keys()
                  ).map((value, i) => ({ key: value, label: value }));

                  return (
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
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <FilterComponent
                                onChange={getOnFilterChange(
                                  header.column.setFilterValue
                                )}
                                value={header.column.getFilterValue()}
                                placeholder={
                                  header.column.columnDef.meta?.placeholder
                                }
                                type={header.column.columnDef.meta?.filterType}
                                options={
                                  header.column.columnDef.meta?.selectOptions
                                    ? header.column.columnDef.meta
                                        ?.selectOptions
                                    : defaultOptions
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length
              ? table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={
                      onRowClick
                        ? (e) => onRowClick({ event: e, row: row.original })
                        : () => null
                    }
                    className={rowClassName(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : getNoDataRows()}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />
    </>
  );
};

export default Table;
