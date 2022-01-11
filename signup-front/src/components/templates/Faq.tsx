import React, { PropsWithChildren, useState } from 'react';
import ContactsTable from '../molecules/ContactTable';
import './Faq.css';
import Link from '../atoms/Link';

const questions = [
  {
    anchor: 'probleme-demande',
    title: 'J’ai une question concernant ma demande',
    body: (
      <>
        <p>
          Pour répondre à votre question, vous pouvez contacter l'équipe qui
          arbitre votre demande :
        </p>
        <ContactsTable />
      </>
    ),
  },
  {
    anchor: 'contact',
    title: 'Je ne trouve pas la réponse à ma question',
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

const QuestionBlock: React.FC<
  PropsWithChildren<{ title: string; anchor: string; openOnMount: boolean }>
> = ({ children, title, anchor, openOnMount }) => {
  const [isOpen, setIsOpen] = useState(openOnMount || false);
  return (
    <div
      id={anchor}
      className={`question-container ${isOpen ? 'open' : 'closed'}`}
    >
      <label onClick={() => setIsOpen(!isOpen)}>{title}</label>
      <div>{children}</div>
    </div>
  );
};

const FAQ: React.FC<{}> = () => (
  <main>
    <div className="page-container">
      <h1>FAQ</h1>
      <p>Comment peut-on vous aider ?</p>
      <div className="questions">
        {questions.map((question) => (
          <QuestionBlock
            anchor={question.anchor}
            title={question.title}
            openOnMount={window.location.hash === `#${question.anchor}`}
          >
            {question.body}
          </QuestionBlock>
        ))}
      </div>
    </div>
  </main>
);

export default FAQ;
