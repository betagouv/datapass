import { STATUS_LABELS } from '../../../config/status-parameters';
import { useDataProviderConfigurations } from '../../templates/hooks/use-data-provider-configurations';
import { useAuth } from '../../organisms/AuthContext';
import MultiSelect from '../../molecules/MultiSelect';
import Label from '../../atoms/inputs/Label';
import Input from '../../atoms/inputs/Input';
import './styles.css';

type InstructorEnrollmentListFiltersProps = {
  filters: any;
  setFilters: any;
};

const InstructorEnrollmentListFilters = ({
  filters,
  setFilters,
}: InstructorEnrollmentListFiltersProps) => {
  const { user } = useAuth();
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  const updateFilter = (filterId: string, value: any) =>
    setFilters((prevFiltered: any) => {
      const filterExists = prevFiltered.find(
        ({ id }: { id: string }) => id === filterId
      );

      if (filterExists) {
        return prevFiltered.map((filter: any) =>
          filter.id === filterId ? { id: filterId, value } : filter
        );
      }

      return [...prevFiltered, { id: filterId, value }];
    });

  return (
    <div className="table-filters">
      <Input
        name="rechercher"
        placeholder="Rechercher dans toutes les habilitations"
        value={
          filters.find(({ id }: { id: string }) => id === 'global_search')
            ?.value
        }
        onChange={(event: any) => {
          updateFilter('global_search', event.target.value);
        }}
      />
      <div className="fr-input-group">
        <Label id="target_api" label="Filtrer par API" />
        <MultiSelect
          id="target_api"
          options={
            user?.roles
              ?.filter((role) => role.endsWith(':reporter'))
              .map((role) => {
                const targetApiKey = role.split(':')[0];

                return {
                  key: targetApiKey,
                  label: dataProviderConfigurations?.[targetApiKey]
                    ?.label as string,
                };
              }) || []
          }
          values={
            filters.find(({ id }: { id: string }) => id === 'target_api')?.value
          }
          onChange={(value: any) => updateFilter('target_api', value)}
        />
      </div>
      <div className="fr-input-group">
        <Label id="status" label="Filtrer par statut" />
        <MultiSelect
          id="status"
          options={Object.entries(STATUS_LABELS)
            .filter(([key]) =>
              user?.roles?.includes('administrator') ? key : key !== 'archived'
            )
            .map(([key, value]) => ({
              key,
              label: value,
            }))}
          values={
            filters.find(({ id }: { id: string }) => id === 'status')?.value
          }
          onChange={(value: any) => updateFilter('status', value)}
        />
      </div>
    </div>
  );
};

export default InstructorEnrollmentListFilters;
