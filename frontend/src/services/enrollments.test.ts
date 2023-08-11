import nock from 'nock';
import {
  getEnrollments,
  getUserEnrollment,
  serializeEnrollment,
} from './enrollments';
import * as UserContext from '../components/organisms/AuthContext';
import FIRST_ENROLLMENT_1 from '../../mock/enrollment-form/first-form-enrollment.json';
import ENROLLMENTS from '../../mock/api/get-user-enrollments-response.json';
import SENT_ENROLLMENT from '../../mock/enrollment-form/sent-enrollment.json';
import { Enrollment } from '../components/templates/InstructorEnrollmentList';

declare module '../components/organisms/AuthContext' {
  interface UserContext {
    resetUserContext?: () => void;
  }
}

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

describe('getEnrollments', () => {
  describe('When there is a response', () => {
    nock(BACK_HOST as string, {
      reqheaders: {
        'Content-Type': 'application/json',
      },
    })
      .get('/api/enrollments/')
      .reply(200, ENROLLMENTS);

    (UserContext as any).resetUserContext = jest.fn();

    it('should return the data', () => {
      return getEnrollments({}).then((response) => {
        expect(response).toEqual(ENROLLMENTS);
      });
    });
  });
});

describe('getUserEnrollment', () => {
  describe('When there is a response', () => {
    nock(BACK_HOST as string, {
      reqheaders: {
        'Content-Type': 'application/json',
      },
    })
      .get('/api/enrollments/1')
      .reply(200, SENT_ENROLLMENT);
    (UserContext as any).resetUserContext = jest.fn();

    it('should return a 200 status', () => {
      return getUserEnrollment(1).then((response) => {
        expect(response).toEqual(SENT_ENROLLMENT);
      });
    });
  });
});

describe('serializeEnrollment', () => {
  describe('When there is a response', () => {
    it('should return a 200 status', () => {
      const enrollment: Enrollment =
        FIRST_ENROLLMENT_1.enrollment as Enrollment;

      const formData = serializeEnrollment(enrollment);
      expect(formData.getAll('enrollment[status]')).toEqual(['draft']);
      expect(formData.getAll('enrollment[intitule]')).toEqual([
        'Nom du fournisseur de service',
      ]);
      expect(formData.getAll('enrollment[description]')).toEqual([
        'Description du service',
      ]);
      expect(formData.getAll('enrollment[cgu_approved]')).toEqual(['true']);
      expect(formData.getAll('enrollment[scopes][birthcountry]')).toEqual([
        'true',
      ]);
      expect(formData.getAll('enrollment[scopes][gender]')).toEqual(['true']);
      expect(formData.getAll('enrollment[target_api]')).toEqual([
        'franceconnect',
      ]);
      expect(formData.getAll('enrollment[contacts][][id]')).toEqual(['dpo']);
      expect(formData.getAll('enrollment[contacts][][heading]')).toEqual([
        'Délégué à la protection des données',
      ]);
      expect(formData.getAll('enrollment[contacts][][nom]')).toEqual(['user']);
      expect(formData.getAll('enrollment[contacts][][email]')).toEqual([
        'user@test',
      ]);
    });
  });
});
