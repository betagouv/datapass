import React, {
  ChangeEventHandler,
  FunctionComponent,
  ReactNode,
  useState,
} from 'react';
import ScopeWarningModalConfigurations, {
  ScopeWarningModalType,
} from '../../../../config/scope-warning-modal-configuration';
import ConfirmationModal from '../../ConfirmationModal';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import FieldsetWrapper from '../../../atoms/inputs/FieldsetWrapper';
import Link from '../../../atoms/hyperTexts/Link';
import Helper from '../../../atoms/Helper';

export type Scope = {
  value: string;
  label: string;
  groupTitle?: string;
  helper?: string;
  required?: boolean;
  triggerWarning?: boolean;
  warningType?: ScopeWarningModalType;
  link?: string;
};

type Props = {
  title: string;
  scopes: Scope[];
  selectedScopes: { [k: string]: boolean };
  disabled: boolean;
  handleChange: ChangeEventHandler<HTMLInputElement>;
};

export const Scopes: FunctionComponent<Props> = ({
  title,
  scopes,
  selectedScopes,
  disabled,
  handleChange,
}) => {
  const [warningModalScope, setWarningModalScope] = useState<string | null>(
    null
  );
  const [warningType, setWarningType] = useState<ScopeWarningModalType | null>(
    ScopeWarningModalType.rgpd
  );

  const handleWarningModalClose = () => {
    handleChange({
      // @ts-ignore
      target: {
        type: 'checkbox',
        checked: true,
        name: `scopes.${warningModalScope}`,
      },
    });
    setWarningModalScope(null);
    setWarningType(ScopeWarningModalType.rgpd);
  };

  let titleToDisplay: ReactNode = title;

  // Adding helpers on group title is an exception made for DGFiP form.
  // This option must not be generalised. It should be removed ASAP.
  if (title === 'Années sur lesquelles porte votre demande') {
    titleToDisplay = (
      <>
        {title}{' '}
        <Helper
          title={
            'Le calendrier de basculement des millésimes est détaillé dans la documentation accessible via la rubrique « Comment choisir les données ? »'
          }
        ></Helper>
      </>
    );
  }

  return (
    <>
      <FieldsetWrapper title={titleToDisplay} grid>
        {scopes.map(
          ({
            value,
            label,
            helper,
            required,
            triggerWarning,
            warningType,
            link,
          }) => (
            <CheckboxInput
              key={value}
              onChange={
                triggerWarning && !selectedScopes[value]
                  ? () => {
                      setWarningType(warningType || ScopeWarningModalType.rgpd);
                      setWarningModalScope(value);
                    }
                  : handleChange
              }
              name={`scopes.${value}`}
              disabled={disabled || required}
              // @ts-ignore
              value={selectedScopes[value]}
              aria-label={`Périmètre de données « ${label} »`}
              label={
                <>
                  {link ? (
                    <span>
                      {label}
                      <Link
                        inline
                        newTab
                        href={link}
                        aria-label={`Plus d’information sur la donnée ${label}`}
                      >
                        {''}
                      </Link>
                    </span>
                  ) : (
                    label
                  )}
                </>
              }
              required={required}
              helper={helper}
            />
          )
        )}
      </FieldsetWrapper>
      {warningModalScope && warningType && (
        <ConfirmationModal
          handleCancel={() => setWarningModalScope(null)}
          handleConfirm={handleWarningModalClose}
          confirmLabel="Ajouter ces données"
          title={ScopeWarningModalConfigurations[warningType].title}
        >
          <p>{ScopeWarningModalConfigurations[warningType].body} </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default Scopes;
