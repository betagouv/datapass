import React, { useState, useEffect } from 'react';

import { copyEnrollment } from '../../services/enrollments';
import { Navigate, useParams } from 'react-router-dom';
import { getErrorMessages } from '../../lib';
import Loader from '../atoms/Loader';
import { Linkify } from '../molecules/Linkify';
import Alert from '../atoms/Alert';

const CopyEnrollment = () => {
  const { enrollmentId } = useParams();

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
      <Navigate
        to={{
          pathname: `/${copiedTargetApi.replace(
            /_/g,
            '-'
          )}/${copiedEnrollmentId}`,
          state: { source: 'copy-authorization-request' },
        }}
        replace
      />
    );
  }

  if (copyErrorMessage) {
    return (
      <div className="full-page">
        <Alert title="Erreur" type="error">
          <Linkify
            message={`${copyErrorMessage} La demande #${enrollmentId} n’a pas été copiée.`}
          />
        </Alert>
      </div>
    );
  }

  return (
    <div className="full-page">
      <Loader />
    </div>
  );
};

export default CopyEnrollment;
