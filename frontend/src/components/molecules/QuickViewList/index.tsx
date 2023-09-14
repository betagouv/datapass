import React from 'react';
import EnrollmentQuickView from './EnrollmentQuickView';
import MessageQuickView from './MessageQuickView';

import './styles.css';

type Props = {
  type: 'messages' | 'enrollments';
  list: Enrollment[];
};

const emptyStates = {
  enrollments: {
    icon: <img src="/images/ok-emoji.svg" alt="Émoji OK" />,
    text: (
      <>
        Vous avez instruit toutes les
        <br /> demandes d’habilitation.
      </>
    ),
  },
  messages: {
    icon: <img src="/images/sunglasses-emoji.svg" alt="Émoji OK" />,
    text: (
      <>
        Vous n’avez pas de
        <br /> message non lu.
      </>
    ),
  },
};

const QuickViewList: React.FC<Props> = ({ list, type = 'enrollments' }) => {
  if (list.length === 0) {
    return (
      <div className="quick-view-list-empty">
        {emptyStates[type].icon}
        <div>{emptyStates[type].text}</div>
      </div>
    );
  }

  const getListComponents = () => {
    switch (type) {
      case 'enrollments':
        return list.map((enrollment) => (
          <EnrollmentQuickView key={enrollment.id} enrollment={enrollment} />
        ));
      case 'messages':
        return list.map((enrollment) => (
          <MessageQuickView key={enrollment.id} enrollment={enrollment} />
        ));

      default:
        throw new Error(
          "QuickViewList n'accepte que des types enrollments ou messages."
        );
    }
  };

  return <div className="quick-view-list-container">{getListComponents()}</div>;
};

export default QuickViewList;
