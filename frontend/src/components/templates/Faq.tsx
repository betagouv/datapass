import React from 'react';
import ContactsTable from '../molecules/ContactTable';
import Link from '../atoms/hyperTexts/Link';
import ExpandableQuote from '../molecules/ExpandableQuote';

const questions = [
  {
    anchor: 'probleme-habilitation',
    title: 'J’ai une question concernant mon habilitation.',
    body: (
      <>
        <p>
          Pour répondre à votre question, vous pouvez contacter l’équipe qui
          instruit votre habilitation :
        </p>
        <ContactsTable />
      </>
    ),
  },
  {
    anchor: 'changement-contact',
    title: 'Comment puis-je modifier les coordonnées de mon compte ?',
    body: (
      <>
        <p>
          Si vous souhaitez modifier les coordonnées de votre compte (par
          exemple si cela vous a été demandé dans le cadre d’une demande
          d’habilitation),{' '}
          <Link
            newTab
            inline
            href="https://auth.api.gouv.fr/users/personal-information"
          >
            rendez-vous ici
          </Link>
          .
        </p>
        <p>
          A noter : Vous ne pouvez pas modifier l’adresse mail associée au
          compte. Si vous souhaitez utiliser une autre adresse mail, merci de{' '}
          <Link newTab inline href="https://auth.api.gouv.fr/users/sign-up">
            créer un nouveau compte
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    anchor: 'ajout-siret',
    title:
      'Puis-je rejoindre une autre organisation que celle à laquelle je suis rattaché(e) ?',
    body: (
      <>
        <p>
          Tout à fait, vous pouvez{' '}
          <Link
            newTab
            inline
            href="https://auth.api.gouv.fr/users/join-organization"
          >
            le faire ici
          </Link>
          .
        </p>
        <p>
          Si vous avez plusieurs organisations associées à votre compte, vous
          pouvez choisir celui pour lequel vous formulez une demande
          d'habilitation dans le cadre « Vous faites cette demande pour ».
        </p>
      </>
    ),
  },
  {
    anchor: 'organisation-etrangere',
    title:
      'Puis-je demander une habilitation pour une organisation étrangère ?',
    body: (
      <>
        Non, DataPass ne permet de demander des habilitations juridiques que
        pour les organisations enregistrées auprès de l’INSEE.
      </>
    ),
  },
  {
    anchor: 'champ-editeur',
    title: 'Comment répondre à la question « Qui va implémenter l’API » ?',
    body: (
      <>
        Sur quelques formulaires d’habilitation, la question « Qui va
        implémenter l’API ? » vous est posée. Cette question permet au
        fournisseur de l’API de vous accompagner au mieux dans son utilisation.
        3 options sont possibles :
        <ul>
          <li>
            Votre éditeur de logiciel : vous utilisez un logiciel, et c’est via
            cet outil que vous allez exploiter les données.
          </li>
          <li>
            Votre équipe de développeurs : les personnes qui vont implémenter
            l’API travaillent dans la même organisation que vous (ou c’est
            vous-même).
          </li>
          <li>
            Autre : si les deux options ci-dessus ne vous conviennent pas, vous
            pouvez indiquer le nom ou le SIRET de l’organisation qui
            implémentera l’API pour vous.
          </li>
        </ul>
      </>
    ),
  },
  {
    anchor: 'liste-editeur',
    title:
      'Que faire si mon éditeur de logiciel n’est pas dans la liste proposée ?',
    body: (
      <>
        Vous pouvez taper le nom de votre éditeur directement, même s’il n’est
        pas dans la liste des éditeurs qui vous est proposée : l’information
        sera prise en compte.
      </>
    ),
  },
  {
    anchor: 'contact',
    title: 'Je ne trouve pas la réponse à ma question.',
    body: (
      <>
        Vous pouvez{' '}
        <Link
          newTab
          inline
          href="mailto:contact@api.gouv.fr?subject=Contact%20via%20la%20FAQ%20datapass.api.gouv.fr"
        >
          nous poser votre question directement.
        </Link>
      </>
    ),
  },
];

const FAQ: React.FC<{}> = () => (
  <main>
    <div className="page-container">
      <h1>FAQ</h1>
      <p>Comment peut-on vous aider ?</p>
      {questions.map((question) => (
        <div
          key={question.anchor}
          id={question.anchor}
          style={{ marginBottom: '1.5rem' }}
        >
          <ExpandableQuote
            title={question.title}
            openOnMount={window.location.hash === `#${question.anchor}`}
            scrollOnMount={window.location.hash === `#${question.anchor}`}
          >
            {question.body}
          </ExpandableQuote>
        </div>
      ))}
    </div>
  </main>
);

export default FAQ;
