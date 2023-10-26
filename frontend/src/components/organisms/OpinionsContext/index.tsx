import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Input from '../../atoms/inputs/Input';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import Button from '../../atoms/hyperTexts/Button';
import { Opinion } from '../../../config';
import { OpinionIcon } from '../../atoms/OpinionIcon';
import {
  createOpinion,
  deleteOpinion,
  getEnrollmentOpinions,
} from '../../../services/opinions';

import './index.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

type OpinionsContextType = {
  isAskingOpinion: boolean;
  opinions: Opinion[];
  getOpinionButton: Function;
  getOpinionContainer: Function;
};

const OpinionsContext = createContext<OpinionsContextType>({
  isAskingOpinion: false,
  opinions: [],
  getOpinionButton: () => null,
  getOpinionContainer: () => null,
});

export const useOpinions = () => {
  return useContext(OpinionsContext);
};

const OpinionForm: React.FC<{
  enrollmentId: number;
  setIsAskingOpinion: Function;
}> = ({ enrollmentId, setIsAskingOpinion }) => {
  const [content, setContent] = useState('');
  const [reporterId, setReporterId] = useState('');

  const disabledSubmit = content.length === 0 || !reporterId;

  return (
    <div className="opinion-form">
      <div className="opinion-form-fields">
        <Input
          label="Vous souhaitez contacter"
          type="text"
          value={reporterId}
          onChange={(event) => setReporterId(event.target.value)}
          placeholder="Vous pouvez saisir un nom, un poste, une organisation"
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
          onClick={() =>
            createOpinion({
              content,
              enrollmentId,
              reporterId: Number(reporterId),
            })
          }
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
  const [isAskingOpinion, setIsAskingOpinion] = useState(false);
  const canAskOpinion = opinions.length === 0;
  const { getIsUserAnInstructor } = useAuth();

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

  const getOpinionContainer = () => {
    const getBody = () => {
      if (opinions.length === 0) {
        return (
          <OpinionForm
            setIsAskingOpinion={setIsAskingOpinion}
            enrollmentId={sanitizedEnrollmentId}
          />
        );
      }

      if (isUserAnInstructor) {
        return opinions.map(({ content, reporter, id }) => (
          <div>
            <div>Demande d'avis à {reporter.email}</div>
            {content}
            <Button
              onClick={() =>
                deleteOpinion({
                  opinionId: id,
                  enrollmentId: sanitizedEnrollmentId,
                })
              }
            >
              Supprimer
            </Button>
          </div>
        ));
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
      }}
    >
      {children}
    </OpinionsContext.Provider>
  );
};

export default OpinionsContainer;
