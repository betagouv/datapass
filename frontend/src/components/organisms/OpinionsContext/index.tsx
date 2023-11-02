import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import Button from '../../atoms/hyperTexts/Button';
import { Opinion, TeamMember } from '../../../config';
import { OpinionIcon } from '../../atoms/OpinionIcon';
import {
  createOpinion,
  deleteOpinion,
  getAvailableReporters,
  getEnrollmentOpinions,
} from '../../../services/opinions';

import './index.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ReportersSearch from '../ReportersSearch';
import moment from 'moment';

type OpinionsContextType = {
  isAskingOpinion: boolean;
  opinions: Opinion[];
  getOpinionButton: Function;
  getOpinionContainer: Function;
  handleDeleteOpinion: Function;
  handleCreateOpinion: Function;
};

const OpinionsContext = createContext<OpinionsContextType>({
  isAskingOpinion: false,
  opinions: [],
  getOpinionButton: () => null,
  getOpinionContainer: () => null,
  handleDeleteOpinion: () => null,
  handleCreateOpinion: () => null,
});

export const useOpinions = () => {
  return useContext(OpinionsContext);
};

const OpinionForm: React.FC<{
  setIsAskingOpinion: Function;
  targetApi: string;
}> = ({ setIsAskingOpinion, targetApi }) => {
  const { handleCreateOpinion } = useOpinions();
  const [content, setContent] = useState('');
  const [reporterId, setReporterId] = useState<null | string>(null);

  const disabledSubmit = content.length === 0 || !reporterId;

  return (
    <div className="opinion-form">
      <div className="opinion-form-fields">
        <ReportersSearch
          targetApi={targetApi}
          onReporterIdChange={setReporterId}
          reporterId={reporterId}
        />
        <TextAreaInput
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          value={content}
          label="Votre message"
          placeholder="Tapez ici votre message"
        />
      </div>
      <div className="opinion-form-buttons">
        <Button onClick={() => setIsAskingOpinion(false)} secondary>
          Annuler
        </Button>
        <Button
          onClick={() => {
            handleCreateOpinion({ content, reporterId });
          }}
          icon="send-plane"
          iconFill
          disabled={disabledSubmit}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
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

  useEffect(() => {
    getAvailableReporters(targetApi!).then((reporters) =>
      setReporters(reporters)
    );
  }, [targetApi]);

  const getOpinionContainer = () => {
    const getBody = () => {
      if (opinions.length === 0) {
        return (
          <OpinionForm
            setIsAskingOpinion={setIsAskingOpinion}
            targetApi={targetApi!}
          />
        );
      }

      const isUserPartOfReporters = reporters.some(
        ({ email }) => email === user!.email
      );

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
              <Button quaternary onClick={() => setIsAskingOpinion(true)}>
                <OpinionIcon bullColor="#000091" heartColor="#0063CB" />
                Répondre
              </Button>
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

    let classNames = 'opinion-button';
    if (isAskingOpinion) {
      classNames += ' activated';
    }

    return (
      <Button
        className={classNames}
        quaternary
        disabled={!canAskOpinion}
        onClick={() => setIsAskingOpinion(true)}
      >
        <OpinionIcon
          bullColor={!canAskOpinion ? '#929292' : '#000091'}
          heartColor={!canAskOpinion ? '#929292' : '#0063CB'}
        />
        Demander un avis
      </Button>
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
      }}
    >
      {children}
    </OpinionsContext.Provider>
  );
};

export default OpinionsContainer;
