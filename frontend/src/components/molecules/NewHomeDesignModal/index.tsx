import AriaModal from '@justfixnyc/react-aria-modal';
import Button from '../../atoms/hyperTexts/Button';
import ButtonGroup from '../../molecules/ButtonGroup';
import useLocalStorage from '../../templates/hooks/use-local-storage';

const NewHomeDesignModal = () => {
  const [hasSeenNewHomeDesign, setHasSeenNewHomeDesign] = useLocalStorage(
    'hasSeenNewHomeDesign',
    false
  );

  return hasSeenNewHomeDesign ? null : (
    <AriaModal
      titleText="Découvrez la nouvelle page d’accueil !"
      focusDialog
      // @ts-ignore
      getApplicationNode={() => document.getElementById('root')}
      scrollDisabled={false}
      alert
    >
      <div
        className="datapass_modal_backdrop"
        onClick={() => setHasSeenNewHomeDesign(true)}
      >
        <div
          className="fr-modal__body datapass_modal_body"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fr-modal__header">
            <h1 className="fr-modal__title fr-text-title--blue-france">
              ✨ Découvrez la nouvelle page d’accueil !
            </h1>
          </div>
          <div className="fr-modal__content">
            <p>
              Nous avons repensé la page d'accueil de DataPass pour vous faire
              gagner du temps sur votre travail d'instruction. Dès la connexion,
              <b>
                {' '}
                vos habilitations “à instruire” sont visibles immédiatement
              </b>
              .
            </p>
            <p>
              La vue “tableau” de toutes les habilitations reste évidemment
              accessible via l’item du menu <b>“Toutes les habilitations”</b>.
            </p>
          </div>
          <div className="fr-modal__footer">
            <ButtonGroup align="right">
              <Button large onClick={() => setHasSeenNewHomeDesign(true)}>
                Ne plus afficher ce message
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </AriaModal>
  );
};

export default NewHomeDesignModal;
