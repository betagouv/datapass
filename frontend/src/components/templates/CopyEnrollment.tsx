import React, { useState, useEffect } from 'react';

import { copyEnrollment } from '../../services/enrollments';
import { Navigate, useParams } from 'react-router-dom';
import { getErrorMessages } from '../../lib';
import Loader from '../atoms/Loader';
import { Linkify } from '../molecules/Linkify';
import Alert, { AlertType } from '../atoms/Alert';

const CopyEnrollment = () => {
  const { enrollmentId }: { enrollmentId?: string } = useParams();

  const [copyErrorMessage, setCopyErrorMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [copiedEnrollmentId, setCopiedEnrollmentId] = useState(null);
  const [copiedTargetApi, setCopiedTargetApi] = useState<string | null>(null);

  const triggerEnrollmentCopy = async ({
    enrollmentId,
  }: {
    enrollmentId: string;
  }) => {
    try {
      setCopyErrorMessage(null);

      const { id, target_api } = await copyEnrollment({
        id: Number(enrollmentId),
      });

      setCopiedEnrollmentId(id);
      setCopiedTargetApi(target_api);
    } catch (e: any) {
      if (e.response?.data?.title && e.response?.data?.message) {
        setCopyErrorMessage(e.response.data);
      } else if (getErrorMessages(e)[0]) {
        setCopyErrorMessage({
          title: 'Erreur',
          message: getErrorMessages(e)[0],
        });
      } else {
        setCopyErrorMessage({
          title: 'Erreur',
          message: 'Erreur inconnue lors de la copie de l’habilitation.',
        });
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
        to={`/${copiedTargetApi.replace(/_/g, '-')}/${copiedEnrollmentId}`}
        state={{ source: 'copy-authorization-request' }}
        replace
      />
    );
  }

  if (copyErrorMessage) {
    return (
      <div className="full-page">
        <Alert title={copyErrorMessage.title} type={AlertType.warning}>
          <Linkify
            message={`${copyErrorMessage.message} L’habilitation #${enrollmentId} n’a pas été copiée.`}
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
