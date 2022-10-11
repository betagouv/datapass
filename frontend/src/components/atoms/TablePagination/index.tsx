// 👇️ ts-nocheck ignores all ts errors in the file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Button from '../hyperTexts/Button';
import NumberInput from '../inputs/NumberInput';
import './style.css';

export default function TablePagination({ table }) {
  return (
    <div className="table-pagination-container">
      <Button
        large
        secondary
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Précédent
      </Button>
      <div className="table-pagination">
        <div>Page</div>
        <NumberInput
          type="number"
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
        <div>sur {table.getPageCount()}</div>
      </div>
      <Button
        secondary
        large
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Suivant
      </Button>
    </div>
  );
}
