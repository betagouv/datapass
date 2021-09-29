import React, { PropsWithChildren, useState } from 'react';
import './Faq.css';

const questions = [
  {
    anchor: 'Hey',
    title: 'J’ai envie d’envoyer plein de mails de support a Mr Dubigny',
    body: <>Ouiiiii bien sur allez-y c'est raphael.dubigny@beta.gouv.fr</>,
  },
  {
    anchor: 'test',
    title: 'Ca, du coup, c’est un test',
    body: (
      <>
        hum test, test, test <br />
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
  <section className="section-white">
    <div className="container">
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
  </section>
);

export default FAQ;
