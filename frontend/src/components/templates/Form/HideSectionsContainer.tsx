import React, {
  Children,
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import Button from '../../atoms/hyperTexts/Button';
import Loader from '../../atoms/Loader';

export type HideSectionsContextType = {
  setReadyForNextSteps: (v: boolean) => void;
};

export const HideSectionsContext = createContext<HideSectionsContextType>({
  setReadyForNextSteps: () => null,
});

type Props = {
  SubmissionPanel: FunctionComponent;
};

export const HideSectionsContainer: FunctionComponent<Props> = ({
  SubmissionPanel,
  children,
}) => {
  const [showOnlyFirstStep, setShowOnlyFirstStep] = useState(false);
  const [isShowNextStepButtonDisabled, setIsShowNextStepButtonDisabled] =
    useState(false);
  const [areNextStepsLoading, setAreNextStepLoading] = useState(false);
  const [readyForNextSteps, setReadyForNextSteps] = useState(true);

  useEffect(() => {
    if (showOnlyFirstStep) {
      setIsShowNextStepButtonDisabled(true);
    }
  }, [setIsShowNextStepButtonDisabled, showOnlyFirstStep]);

  const showNextStep = () => {
    setIsShowNextStepButtonDisabled(true);
    setAreNextStepLoading(true);
    setTimeout(() => {
      setAreNextStepLoading(false);
      setShowOnlyFirstStep(false);
    }, 900);
  };

  useEffect(() => {
    if (!showOnlyFirstStep && !readyForNextSteps) {
      setShowOnlyFirstStep(true);
    }

    if (showOnlyFirstStep) {
      setIsShowNextStepButtonDisabled(!readyForNextSteps);
    }
  }, [
    readyForNextSteps,
    showOnlyFirstStep,
    setShowOnlyFirstStep,
    setIsShowNextStepButtonDisabled,
  ]);

  return (
    <>
      <HideSectionsContext.Provider
        value={{
          setReadyForNextSteps,
        }}
      >
        {Children.map(children, (child, index) =>
          showOnlyFirstStep && index > 0 ? (
            // we render the child in a display none div instead of not rendering the component
            // in that way, section that has initialisation action on formContext can do it.
            <div style={{ display: 'none' }}>{child}</div>
          ) : (
            child
          )
        )}
      </HideSectionsContext.Provider>

      {showOnlyFirstStep && !areNextStepsLoading && (
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            marginBottom: '2rem',
          }}
        >
          <Button
            icon="arrow-down"
            iconRight
            xLarge
            disabled={isShowNextStepButtonDisabled}
            onClick={showNextStep}
          >
            Suivant
          </Button>
        </div>
      )}

      {showOnlyFirstStep && areNextStepsLoading && (
        <Loader message="Nous pré-remplissons le formulaire en fonction de vos réponses." />
      )}

      {!showOnlyFirstStep && <SubmissionPanel />}
    </>
  );
};

export default HideSectionsContainer;
