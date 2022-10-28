import { FunctionComponent } from 'react';
import { dataProviderConfigurationsToContactInfo } from '../../lib';
import Link from '../atoms/hyperTexts/Link';
import Table from '../organisms/Table';
import {
  Column,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useDataProviderConfigurations } from '../templates/hooks/use-data-provider-configurations';

type contactInfoType = {
  label: string;
  email: string;
};
const columnHelper = createColumnHelper<contactInfoType>();

const ContactsTable: FunctionComponent = () => {
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  const contactInfo: contactInfoType[] =
    dataProviderConfigurationsToContactInfo(dataProviderConfigurations);

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
        data: contactInfo,
        columns: getColumnConfiguration() as Column<contactInfoType>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      }}
    />
  );
};

export default ContactsTable;
