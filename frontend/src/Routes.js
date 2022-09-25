import { isEmpty } from 'lodash';
import React, { useLayoutEffect } from 'react';
import {
  Route,
  Routes as ReactRouterRoutes,
  useLocation,
} from 'react-router-dom';
import { AuthRequired, useAuth } from './components/organisms/AuthContext';
import FormRouter from './components/organisms/FormRouter';
import Accessibilite from './components/templates/Accessibilite';
import Admin from './components/templates/Admin';
import CopyEnrollment from './components/templates/CopyEnrollment';
import DataProviderList from './components/templates/DataProviderList';
import Enrollment from './components/templates/Enrollment';
import FAQ from './components/templates/Faq';
import InstructorEnrollmentList from './components/templates/InstructorEnrollmentList';
import PublicEnrollmentList from './components/templates/PublicEnrollmentList';
import Stats from './components/templates/Stats';
import UserEnrollmentList from './components/templates/UserEnrollmentList';

export const Routes = () => {
  const { user } = useAuth();
  const location = useLocation();

  useLayoutEffect(() => {
    if (!location.state?.noScroll) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state?.noScroll]);

  return (
    <ReactRouterRoutes>
      <Route path="public" element={<PublicEnrollmentList />}>
        <Route path=":targetApi" element={<PublicEnrollmentList />} />
      </Route>

      <Route path="stats" element={<Stats />}>
        <Route path=":targetApi" element={<Stats />} />
      </Route>

      <Route path="accessibilite" element={<Accessibilite />} />

      <Route path="faq" element={<FAQ />} />

      <Route path="data-providers" element={<DataProviderList />} />

      <Route path="admin" element={<AuthRequired children={<Admin />} />} />

      <Route
        path="copy-authorization-request/:enrollmentId"
        element={<AuthRequired children={<CopyEnrollment />} />}
      />

      <Route
        path="authorization-request/:enrollmentId"
        element={<AuthRequired children={<Enrollment />} />}
      />

      <Route
        index
        element={
          <AuthRequired>
            {/* {user && isEmpty(user.roles) && user.organizations.length < 5 ? (
              <UserEnrollmentList />
            ) : (
              <AdminEnrollmentList />
            )} */}
            <InstructorEnrollmentList />
          </AuthRequired>
        }
      />

      <Route path=":targetApi" element={<FormRouter />}>
        <Route path=":enrollmentId" element={<FormRouter />} />
      </Route>
    </ReactRouterRoutes>
  );
};

export default Routes;
