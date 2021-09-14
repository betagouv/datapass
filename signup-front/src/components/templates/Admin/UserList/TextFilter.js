import React from 'react';

export const textFilter = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return (
      rowValue === undefined ||
      String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase())
    );
  });
};

export const TextFilter = ({ column: { filterValue, setFilter } }) => (
  <div>
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Rechercher...`}
    />
  </div>
);
