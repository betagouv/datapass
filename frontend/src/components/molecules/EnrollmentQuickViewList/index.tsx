import React from 'react';
import { Enrollment } from '../../templates/InstructorEnrollmentList';
import EnrollmentQuickView from './EnrollmentQuickView';

type Props = {
  enrollments: Enrollment[];
};

const EnrollmentQuickViewList: React.FC<Props> = ({ enrollments }) => {
  return (
    <div className="enrollment-quick-view-container">
      {enrollments.map((enrollment) => (
        <EnrollmentQuickView enrollment={enrollment} />
      ))}
    </div>
  );
};

export default EnrollmentQuickViewList;
