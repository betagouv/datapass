import { FunctionComponent } from 'react';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { dataProviderParametersToContactInfo } from '../../lib';
import Link from '../atoms/hyperTexts/Link';
import Table from '../organisms/Table';
import {
  Column,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

type dataProviderInfoType = {
  label: string;
  email: string;
};
const columnHelper = createColumnHelper<dataProviderInfoType>();

const ContactsTable: FunctionComponent = () => {
  const dataProviderInfo: dataProviderInfoType[] =
    dataProviderParametersToContactInfo(DATA_PROVIDER_PARAMETERS);

  const getColumnConfiguration = () => [
    columnHelper.accessor('label', {
      enableColumnFilter: false,
      header: 'Nature de l’habilitation',
    }),
    columnHelper.accessor('email', {
      enableColumnFilter: false,
      enableSorting: false,
      header: 'Contact',
      cell: ({ getValue }) => (
        <Link
          inline
          href={`mailto:${getValue()}?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr`}
        >
          Écrire à l’équipe
        </Link>
      ),
    }),
  ];

  return (
    <Table
      tableOptions={{
        data: dataProviderInfo,
        columns: getColumnConfiguration() as Column<dataProviderInfoType>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      }}
    />
  );
};

export default ContactsTable;
