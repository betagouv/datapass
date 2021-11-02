import { cloneDeep, get, isObject, merge, omitBy, set } from 'lodash';

export const globalUpdate = ({ previousEnrollment, futureEnrollment }) =>
  merge(
    {},
    previousEnrollment,
    omitBy(futureEnrollment, (e) => e === null) // do not merge null properties, keep empty string instead to avoid controlled input to switch to uncontrolled input
  );

export const eventUpdateFactory =
  (demarches = null) =>
  ({
    previousEnrollment,
    event: {
      target: { type = null, checked = null, value: inputValue, name },
    },
  }) => {
    const value = type === 'checkbox' ? checked : inputValue;

    let futureEnrollment = cloneDeep(previousEnrollment);
    set(futureEnrollment, name, value);

    if (demarches && name === 'demarche') {
      futureEnrollment = merge(
        {},
        futureEnrollment,
        get(demarches, 'default', {}).state,
        get(demarches, value, {}).state
      );
    }

    return futureEnrollment;
  };

export const enrollmentReducerFactory =
  (demarches = null) =>
  (previousEnrollment, eventOrFutureEnrollment) => {
    if (!isObject(eventOrFutureEnrollment)) {
      return previousEnrollment;
    }

    // if no eventOrFutureEnrollment.target, this is a direct state update (network for instance)
    // a direct state update DOES NOT trigger a pre-filled demarche update
    if (!eventOrFutureEnrollment.target) {
      const futureEnrollment = eventOrFutureEnrollment;

      return globalUpdate({ previousEnrollment, futureEnrollment });
    }

    // if eventOrFutureEnrollment.target, it means reducer was trigger by an html element (input, select etc.)
    const event = eventOrFutureEnrollment;
    return eventUpdateFactory(demarches)({
      previousEnrollment,
      event,
    });
  };

export default enrollmentReducerFactory;
