import { isEmpty } from 'lodash';
import { useLayoutEffect } from 'react';
import {
  Route,
  Routes as ReactRouterRoutes,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { AuthRequired, useAuth } from './components/organisms/AuthContext';
import FormRouter from './components/organisms/FormRouter';
import Accessibilite from './components/templates/Accessibilite';
import Admin from './components/templates/Admin';
import CopyEnrollment from './components/templates/CopyEnrollment';
import HubeeDataProviderList from './components/templates/DataProviderList/HubeeDataProviderList';
import ApiDataProviderList from './components/templates/DataProviderList/ApiDataProviderList';
import RedirectToTheRightDataProviderForm from './components/templates/RedirectToTheRightDataProviderForm';
import FAQ from './components/templates/Faq';
import AdminEnrollmentList from './components/templates/InstructorEnrollmentList';
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
      <Route path="public" element={<PublicEnrollmentList />} />

      <Route path="stats" element={<Stats />}>
        <Route path=":targetApi" element={<Stats />} />
      </Route>

      <Route path="accessibilite" element={<Accessibilite />} />

      <Route path="faq" element={<FAQ />} />

      <Route path="data-providers/hubee" element={<HubeeDataProviderList />} />
      <Route path="data-providers/api" element={<ApiDataProviderList />} />

      <Route path="admin" element={<AuthRequired children={<Admin />} />} />

      <Route
        path="copy-authorization-request/:enrollmentId"
        element={<AuthRequired children={<CopyEnrollment />} />}
      />

      <Route
        path="authorization-request/:enrollmentId"
        element={
          <AuthRequired children={<RedirectToTheRightDataProviderForm />} />
        }
      />

      <Route
        index
        element={
          <AuthRequired>
            {user && isEmpty(user.roles) && user.organizations.length < 5 ? (
              <UserEnrollmentList />
            ) : null}
          </AuthRequired>
        }
      />

      <Route
        path="enrollments"
        element={
          <AuthRequired>
            {user && isEmpty(user.roles) && user.organizations.length < 5 ? (
              <Navigate to="/" replace />
            ) : (
              <AdminEnrollmentList />
            )}
          </AuthRequired>
        }
      />

      <Route
        path=":targetApi"
        element={
          <AuthRequired>
            <FormRouter />
          </AuthRequired>
        }
      >
        <Route
          path=":enrollmentId"
          element={
            <AuthRequired>
              <FormRouter />
            </AuthRequired>
          }
        />
      </Route>
    </ReactRouterRoutes>
  );
};

export default Routes;
