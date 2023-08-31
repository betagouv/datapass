import { useEffect, useMemo, useState } from 'react';
import { getEmailTemplates } from '../../../../../services/enrollments';
import { useAuth } from '../../../../organisms/AuthContext';

const useEmailTemplate = (
  enrollmentId: number,
  event: string,
  targetApi: string
) => {
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);

  const { getIsUserAnInstructor } = useAuth();

  const isUserAnInstructor = useMemo(() => {
    return getIsUserAnInstructor(targetApi);
  }, [getIsUserAnInstructor, targetApi]);

  useEffect(() => {
    async function fetchEmailTemplate() {
      if (!isUserAnInstructor || !event || !enrollmentId) return null;

      const emailTemplates = await getEmailTemplates({ id: enrollmentId });
      const emailTemplate = emailTemplates.find(
        (template) => template.event === event
      );

      if (emailTemplate?.plain_text_content) {
        setEmailTemplate(emailTemplate.plain_text_content);
      }
    }

    fetchEmailTemplate();
  }, [event, enrollmentId, isUserAnInstructor]);

  return emailTemplate;
};

export default useEmailTemplate;
