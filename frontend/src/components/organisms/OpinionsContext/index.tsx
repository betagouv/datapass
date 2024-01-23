import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Opinion, TeamMember } from '../../../config';
import {
  createOpinion,
  createOpinionComment,
  deleteOpinion,
  deleteOpinionComment,
  getAvailableReporters,
  getEnrollmentOpinions,
} from '../../../services/opinions';

import './index.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AnswerButton from '../../molecules/AnswerButton';
import InstructorOpinionForm from './InstructorOpinionForm';
import ReporterOpinionForm from './ReporterOpinionForm';
import OpinionEvent from './OpinionEvent';

type OpinionsContextType = {
  isAskingOpinion: boolean;
  opinions: Opinion[];
  getOpinionButton: Function;
  getOpinionContainer: Function;
  handleDeleteOpinion: Function;
  handleCreateOpinion: Function;
  handleCreateOpinionComment: Function;
};

const OpinionsContext = createContext<OpinionsContextType>({
  isAskingOpinion: false,
  opinions: [],
  getOpinionButton: () => null,
  getOpinionContainer: () => null,
  handleDeleteOpinion: () => null,
  handleCreateOpinion: () => null,
  handleCreateOpinionComment: () => null,
});

export const useOpinions = () => {
  return useContext(OpinionsContext);
};

const OpinionsContainer: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const { targetApi: rawTargetApi, enrollmentId: rawEnrollmentId } =
    useParams();
  const targetApi = (rawTargetApi as string).replace(/-/g, '_');
  const sanitizedEnrollmentId = Number(rawEnrollmentId);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [reporters, setReporters] = useState<TeamMember[]>([]);
  const [isAskingOpinion, setIsAskingOpinion] = useState(false);
  const canAskOpinion = opinions.length === 0;
  const { user, getIsUserAnInstructor } = useAuth();
  const isUserPartOfReporters = reporters.some(
    ({ email }) => email === user!.email
  );

  const isUserAnInstructor = useMemo(() => {
    return getIsUserAnInstructor(targetApi!);
  }, [getIsUserAnInstructor, targetApi]);

  useEffect(() => {
    if (sanitizedEnrollmentId) {
      getEnrollmentOpinions(sanitizedEnrollmentId).then((opinions) => {
        setOpinions(opinions);
      });
    }
  }, [sanitizedEnrollmentId]);

  const handleDeleteOpinion = async (opinionId: number) => {
    await deleteOpinion({
      opinionId,
      enrollmentId: sanitizedEnrollmentId,
    });
    setOpinions(opinions.filter((opinion) => opinion.id !== opinionId));
  };

  const handleCreateOpinion = async ({
    content,
    reporterId,
  }: {
    content: string;
    reporterId: string;
  }) => {
    const newOpinion = await createOpinion({
      content,
      enrollmentId: sanitizedEnrollmentId,
      reporterId: Number(reporterId),
    });
    setOpinions([...opinions, newOpinion]);
    setIsAskingOpinion(false);
  };

  const handleCreateOpinionComment = async ({
    content,
  }: {
    content: string;
  }) => {
    await createOpinionComment({
      opinionId: opinions[opinions.length - 1].id,
      content,
      enrollmentId: sanitizedEnrollmentId,
    });

    const newOpinions = await getEnrollmentOpinions(sanitizedEnrollmentId);
    setOpinions(newOpinions);
    setIsAskingOpinion(false);
  };

  const handleDeleteOpinionComment = async ({
    commentId,
  }: {
    commentId: number;
  }) => {
    await deleteOpinionComment({
      opinionId: opinions[opinions.length - 1].id,
      commentId,
      enrollmentId: sanitizedEnrollmentId,
    });

    const newOpinions = await getEnrollmentOpinions(sanitizedEnrollmentId);
    setOpinions(newOpinions);
  };

  useEffect(() => {
    getAvailableReporters(targetApi!).then((reporters) =>
      setReporters(reporters)
    );
  }, [targetApi]);

  const getOpinionContainer = () => {
    const getBody = () => {
      if (opinions.length === 0) {
        return (
          <InstructorOpinionForm
            setIsAskingOpinion={setIsAskingOpinion}
            targetApi={targetApi!}
          />
        );
      }

      if (isUserAnInstructor || isUserPartOfReporters) {
        const { content, reporter, id, comment, created_at } =
          opinions[opinions.length - 1];
        const canDeleteOpinion = !comment && reporter.id === user!.id;
        return (
          <div className="opinion-events">
            <OpinionEvent
              handleDelete={
                canDeleteOpinion ? () => handleDeleteOpinion(id) : null
              }
              content={content}
              titlePrefix="Demande d'avis à"
              title={reporter.email!}
              created_at={created_at}
            />

            {!comment && (
              <ReporterOpinionForm
                isAskingOpinion={isAskingOpinion}
                setIsAskingOpinion={setIsAskingOpinion}
              />
            )}

            {!!comment && (
              <OpinionEvent
                key={comment.id}
                handleDelete={() =>
                  handleDeleteOpinionComment({ commentId: comment.id })
                }
                content={comment.content}
                titlePrefix="Réponse de"
                title={comment.user.email!}
                created_at={comment.created_at}
              />
            )}
          </div>
        );
      }
    };

    if (opinions.length > 0 || isAskingOpinion) {
      return (
        <div className="opinion-container">
          <div
            className={`opinion-wrapper ${
              isAskingOpinion ? 'asking-opinion' : ''
            }`}
          >
            <div className="opinion-title">
              <img src="/images/opinion.svg" alt="Demande d'avis" />
              <h5>Demande d'avis</h5>
            </div>
            {getBody()}
          </div>
        </div>
      );
    }
  };

  const getOpinionButton = () => {
    if (!isUserAnInstructor) {
      return null;
    }

    return (
      <AnswerButton
        hidden={isAskingOpinion}
        disabled={!canAskOpinion}
        onClick={() => setIsAskingOpinion(true)}
      >
        Demander un avis
      </AnswerButton>
    );
  };

  return (
    <OpinionsContext.Provider
      value={{
        isAskingOpinion,
        opinions,
        getOpinionButton,
        getOpinionContainer,
        handleCreateOpinion,
        handleDeleteOpinion,
        handleCreateOpinionComment,
      }}
    >
      {children}
    </OpinionsContext.Provider>
  );
};

export default OpinionsContainer;
