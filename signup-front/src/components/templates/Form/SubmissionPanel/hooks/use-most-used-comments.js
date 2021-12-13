import { useState, useEffect } from 'react';
import { getMostUsedComments } from '../../../../../services/enrollments';

const useMostUsedComments = (event, targetApi) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchMostUsedComments() {
      if (!event || !targetApi) return null;

      const comments = await getMostUsedComments({
        event,
        targetApi,
      });

      setComments(comments);
    }

    fetchMostUsedComments();
  }, [event, targetApi]);

  return comments;
};

export default useMostUsedComments;
