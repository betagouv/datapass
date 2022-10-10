// 👇️ ts-nocheck ignores all ts errors in the file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Table from '../../atoms/Table';

export default function EnrollmentTable({
  columns,
  data,
  autoResetAll,
  updateData,
}) {
  return (
    <Table
      columns={columns}
      data={data}
      autoResetAll={autoResetAll}
      updateData={updateData}
    />
  );
}
