import React from 'react';
import ContactsTable from '../molecules/ContactTable';
import Link from '../atoms/hyperTexts/Link';
import ExpandableQuote from '../molecules/ExpandableQuote';

const questions = [
  {
    anchor: 'probleme-habilitation',
    title: 'J’ai une question concernant mon habilitation ?',
    body: (
      <>
        <p>
          Pour répondre à votre question, vous pouvez contacter l'équipe qui
          instruit votre habilitation :
        </p>
        <ContactsTable />
      </>
    ),
  },
  {
    anchor: 'contact',
    title: 'Je ne trouve pas la réponse à ma question ?',
    body: (
      <>
        Vous pouvez{' '}
        <Link
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
      <p>Comment peut-on vous aider ?</p>
      {questions.map((question) => (
        <div
          key={question.anchor}
          id={question.anchor}
          style={{ marginBottom: '1.5rem' }}
        >
          <ExpandableQuote
            title={question.title}
            openOnMount={window.location.hash === `#${question.anchor}`}
          >
            {question.body}
          </ExpandableQuote>
        </div>
      ))}
    </div>
  </main>
);

export default FAQ;
