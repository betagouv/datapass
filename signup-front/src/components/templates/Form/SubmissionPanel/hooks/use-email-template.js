import { useEffect, useState } from 'react';
import { getEmailTemplates } from '../../../../../services/enrollments';

const useEmailTemplate = (enrollmentId, selectedAction) => {
  const [emailTemplate, setEmailTemplate] = useState([]);
  useEffect(() => {
    async function fetchEmailTemplate() {
      if (!selectedAction || !enrollmentId) return null;

      const emailTemplates = await getEmailTemplates({ id: enrollmentId });
      const emailTemplate = emailTemplates.find(
        ({ action_name }) => action_name === selectedAction
      );

      setEmailTemplate(emailTemplate);
    }

    fetchEmailTemplate();
  }, [selectedAction, enrollmentId]);

  return emailTemplate;
};

export default useEmailTemplate;
