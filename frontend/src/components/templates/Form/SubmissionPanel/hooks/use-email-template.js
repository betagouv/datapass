import { useEffect, useState } from 'react';
import { getEmailTemplates } from '../../../../../services/enrollments';

const useEmailTemplate = (enrollmentId, event) => {
  const [emailTemplate, setEmailTemplate] = useState([]);
  useEffect(() => {
    async function fetchEmailTemplate() {
      if (!event || !enrollmentId) return null;

      const emailTemplates = await getEmailTemplates({ id: enrollmentId });
      const emailTemplate = emailTemplates.find(({ event: e }) => e === event);

      setEmailTemplate(emailTemplate);
    }

    fetchEmailTemplate();
  }, [event, enrollmentId]);

  return emailTemplate;
};

export default useEmailTemplate;
