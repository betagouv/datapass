import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Button from '../../atoms/hyperTexts/Button';
import { Opinion, TeamMember } from '../../../config';
import {
  createOpinion,
  createOpinionComment,
  deleteOpinion,
  getAvailableReporters,
  getEnrollmentOpinions,
} from '../../../services/opinions';

import './index.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import moment from 'moment';
import AnswerButton from '../../molecules/AnswerButton';
import InstructorOpinionForm from './InstructorOpinionForm';
import ReporterOpinionForm from './ReporterOpinionForm';

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
  const { targetApi, enrollmentId: rawEnrollmentId } = useParams();
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
        const { content, reporter, id, comments, created_at } =
          opinions[opinions.length - 1];
        return (
          <div className="opinion-events">
            <div className="opinion-event">
              <div className="opinion-event-title">
                <div className="opinion-event-title-prefix">
                  Demande d'avis à
                </div>
                <div className="opinion-event-title-name">{reporter.email}</div>
              </div>
              <div className="opinion-event-content">
                <div className="opinion-event-content-body">{content}</div>
                <div className="opinion-event-content-footer">
                  <div className="opinion-event-content-date">
                    Le {moment(created_at).format('DD/MM/YY à HH:mm')}
                  </div>
                  {comments.length === 0 && (
                    <Button onClick={() => handleDeleteOpinion(id)}>
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {comments.length === 0 && (
              <ReporterOpinionForm
                isAskingOpinion={isAskingOpinion}
                setIsAskingOpinion={setIsAskingOpinion}
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
