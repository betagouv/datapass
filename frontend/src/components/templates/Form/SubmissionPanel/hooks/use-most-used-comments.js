import { useEffect, useMemo, useState } from 'react';
import { getMostUsedComments } from '../../../../../services/enrollments';
import { useAuth } from '../../../../organisms/AuthContext';

const useMostUsedComments = (event, targetApi) => {
  const [comments, setComments] = useState([]);

  const { user } = useAuth();

  const isUserAnInstructor = useMemo(() => {
    const targetApiInstructorRole = `${targetApi}:instructor`;
    const userInstructor = user.roles.includes(targetApiInstructorRole);

    return userInstructor;
  }, [user, targetApi]);

  useEffect(() => {
    async function fetchMostUsedComments() {
      if (!isUserAnInstructor || !event || !targetApi) return null;

      const comments = await getMostUsedComments({
        event,
        targetApi,
      });

      setComments(comments);
    }

    fetchMostUsedComments();
  }, [event, targetApi, isUserAnInstructor]);

  return comments;
};

export default useMostUsedComments;
