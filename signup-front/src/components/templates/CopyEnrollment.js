import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { copyEnrollment } from '../../services/enrollments';
import { Redirect } from 'react-router-dom';
import { getErrorMessages } from '../../lib';
import Loader from '../atoms/Loader';
import { Linkify } from '../molecules/Linkify';

const CopyEnrollment = ({
  match: {
    params: { enrollmentId },
  },
}) => {
  const [copyErrorMessage, setCopyErrorMessage] = useState(null);
  const [copiedEnrollmentId, setCopiedEnrollmentId] = useState(null);
  const [copiedTargetApi, setCopiedTargetApi] = useState(null);

  const triggerEnrollmentCopy = async ({ enrollmentId }) => {
    try {
      setCopyErrorMessage(null);

      const { id, target_api } = await copyEnrollment({
        id: enrollmentId,
      });

      setCopiedEnrollmentId(id);
      setCopiedTargetApi(target_api);
    } catch (e) {
      if (getErrorMessages(e)[0]) {
        setCopyErrorMessage(getErrorMessages(e)[0]);
      } else {
        setCopyErrorMessage(
          'Erreur inconnue lors de la copie de la demande d’habilitation.'
        );
      }
    }
  };

  useEffect(() => {
    if (enrollmentId) {
      triggerEnrollmentCopy({ enrollmentId });
    }
  }, [enrollmentId]);

  if (copiedEnrollmentId && copiedTargetApi) {
    return (
      <Redirect
        to={{
          pathname: `/${copiedTargetApi.replace(
            /_/g,
            '-'
          )}/${copiedEnrollmentId}`,
          state: { source: 'copy-authorization-request' },
        }}
      />
    );
  }

  if (copyErrorMessage) {
    return (
      <section className="full-page">
        <div className="notification error">
          <Linkify
            message={`Erreur : ${copyErrorMessage} La demande #${enrollmentId} n’a pas été copiée.`}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="full-page">
      <Loader />
    </section>
  );
};

CopyEnrollment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

CopyEnrollment.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default CopyEnrollment;
