import { useEffect, useMemo, useState } from 'react';
import { getMostUsedComments } from '../../../../../services/enrollments';
import { useAuth } from '../../../../organisms/AuthContext';

const useMostUsedComments = (event: string, targetApi: string) => {
  const [comments, setComments] = useState([]);

  const { getIsUserAnInstructor } = useAuth();

  const isUserAnInstructor = useMemo(() => {
    return getIsUserAnInstructor(targetApi);
  }, [getIsUserAnInstructor, targetApi]);

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
