import React from 'react';
import { get, isEmpty } from 'lodash';
import Stepper from '../../molecules/Stepper';
import { withRouter } from 'react-router-dom';

export const StepperSection = ({ location }) => (
  <>
    {!isEmpty(get(location, 'state.fromFranceConnectedAPI')) && (
      <div>
        <p>La procédure consiste en 2 habilitations distinctes :</p>
        <Stepper
          steps={[
            'franceconnect',
            get(location, 'state.fromFranceConnectedAPI'),
          ]}
          currentStep="franceconnect"
        />
      </div>
    )}
    {get(location, 'state.fromFranceConnectedAPI') ===
      'api_impot_particulier_fc_sandbox' && (
      <div>
        <p>La procédure consiste en 3 habilitations distinctes :</p>
        <Stepper
          steps={[
            'franceconnect',
            'api_impot_particulier_fc_sandbox',
            'api_impot_particulier_fc_production',
          ]}
          currentStep="franceconnect"
        />
      </div>
    )}
  </>
);

export default withRouter(StepperSection);
