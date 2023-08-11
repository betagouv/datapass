import {
  Children,
  cloneElement,
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import Button from '../../atoms/hyperTexts/Button';
import Loader from '../../atoms/Loader';

export type HideSectionsContextType = {
  setReadyForNextSteps: (v: boolean) => void;
  setLastIndexToShow: (v: number) => void;
};

export const HideSectionsContext = createContext<HideSectionsContextType>({
  setReadyForNextSteps: () => null,
  setLastIndexToShow: () => null,
});

export const HideSectionsContainer: FunctionComponent<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  const [showOnlyFirstStep, setShowOnlyFirstStep] = useState(false);
  const [isShowNextStepButtonDisabled, setIsShowNextStepButtonDisabled] =
    useState(false);
  const [areNextStepsLoading, setAreNextStepLoading] = useState(false);
  const [readyForNextSteps, setReadyForNextSteps] = useState(true);
  const [lastIndexToShow, setLastIndexToShow] = useState(0);

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
          setLastIndexToShow,
        }}
      >
        {Children.map(children, (child, index) =>
          showOnlyFirstStep && index > lastIndexToShow ? (
            // we render the child in a display none div instead of not rendering the component
            // in that way, section that has initialisation action on formContext can do it.
            <div style={{ display: 'none' }}>
              {
                // @ts-ignore
                cloneElement(child, {
                  sectionIndex: index,
                })
              }
            </div>
          ) : (
            // @ts-ignore
            cloneElement(child, { sectionIndex: index })
          )
        )}
      </HideSectionsContext.Provider>

      {showOnlyFirstStep && !areNextStepsLoading && (
        <div
          className="fr-mb-4w"
          style={{
            display: 'flex',
            alignSelf: 'center',
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
    </>
  );
};

export default HideSectionsContainer;
