import React, { useLayoutEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import PublicEnrollmentList from './components/templates/PublicEnrollmentList';
import Stats from './components/templates/Stats';
import Accessibilite from './components/templates/Accessibilite';
import PrivateRoute from './components/organisms/PrivateRoute';
import { isEmpty } from 'lodash';
import AdminEnrollmentList from './components/templates/AdminEnrollmentList';
import ApiImpotParticulierSandbox from './pages/DgfipPages/ApiImpotParticulierSandbox';
import ApiImpotParticulierProduction from './pages/DgfipPages/ApiImpotParticulierProduction';
import ApiImpotParticulierFcSandbox from './pages/DgfipPages/ApiImpotParticulierFcSandbox';
import ApiImpotParticulierFcProduction from './pages/DgfipPages/ApiImpotParticulierFcProduction';
import ApiR2PSandbox from './pages/DgfipPages/ApiR2PSandbox';
import ApiR2PProduction from './pages/DgfipPages/ApiR2PProduction';
import ApiFicobaSandbox from './pages/DgfipPages/ApiFicobaSandbox';
import ApiFicobaProduction from './pages/DgfipPages/ApiFicobaProduction';
import FranceConnect from './pages/FranceConnect';
import AidantsConnect from './pages/AidantsConnect';
import ApiDroitsCnam from './pages/ApiDroitsCnam';
import LeTaxiClients from './pages/LeTaxiClients';
import LeTaxiChauffeurs from './pages/LeTaxiChauffeurs';
import CartoBio from './pages/CartoBio';
import ApiHermesSandbox from './pages/DgfipPages/ApiHermesSandbox';
import ApiHermesProduction from './pages/DgfipPages/ApiHermesProduction';
import ApiProSanteConnect from './pages/ApiProSanteConnect';
import CopyEnrollment from './components/templates/CopyEnrollment';
import Enrollment from './components/templates/Enrollment';
import ApiParticulier from './pages/ApiParticulier';
import UserEnrollmentList from './components/templates/UserEnrollmentList';
import ApiEntreprise from './pages/ApiEntreprise';
import ApiServiceNational from './pages/ApiServiceNational';
import ApiTiersDePrestation from './pages/UrssafPages/ApiTiersDePrestation';
import Hubee from './pages/Hubee';
import Admin from './components/templates/Admin';
import { withUser } from './components/organisms/UserContext';
import ApiDeclarationAutoEntrepreneur from './pages/UrssafPages/ApiDeclarationAutoEntrepreneur';
import ApiIndemnitesJournalieresCnam from './pages/ApiIndemnitesJournalieresCnam';
import ApiEContactsSandbox from './pages/DgfipPages/ApiEContactsSandbox';
import ApiEContactsProduction from './pages/DgfipPages/ApiEContactsProduction';
import ApiOpaleSandbox from './pages/DgfipPages/ApiOpaleSandbox';
import ApiOpaleProduction from './pages/DgfipPages/ApiOpaleProduction';
import ApiMireSandbox from './pages/DgfipPages/ApiMireSandbox';
import ApiMireProduction from './pages/DgfipPages/ApiMireProduction';
import ApiOcfiSandbox from './pages/DgfipPages/ApiOcfiSandbox';
import ApiOcfiProduction from './pages/DgfipPages/ApiOcfiProduction';
import ApiEProSandbox from './pages/DgfipPages/ApiEProSandbox';
import ApiEProProduction from './pages/DgfipPages/ApiEProProduction';
import ApiRobfSandbox from './pages/DgfipPages/ApiRobfSandbox';
import ApiRobfProduction from './pages/DgfipPages/ApiRobfProduction';
import ApiCprProSandbox from './pages/DgfipPages/ApiCprProSandbox';
import ApiCprProProduction from './pages/DgfipPages/ApiCprProProduction';
import ApiInfinoeSandbox from './pages/DgfipPages/ApiInfinoeSandbox';
import ApiInfinoeProduction from './pages/DgfipPages/ApiInfinoeProduction';
import ApiSystemeImmatriculationVehicules from './pages/ApiSystemeImmatriculationVehicules';
import FAQ from './components/templates/Faq';
import ApiDeclarationCesu from './pages/UrssafPages/ApiDeclarationCesu';

export const Routes = ({ user }) => {
  const location = useLocation();

  useLayoutEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return (
    <>
      <Route path="/public/:targetApi?" component={PublicEnrollmentList} />

      <Route path="/stats/:targetApi?" component={Stats} />

      <Route path="/accessibilite" component={Accessibilite} />

      <Route path="/faq" component={FAQ} />

      <PrivateRoute
        exact
        path="/"
        component={
          user && isEmpty(user.roles) && user.organizations.length < 5
            ? UserEnrollmentList
            : AdminEnrollmentList
        }
      />

      <PrivateRoute
        path="/api-particulier/:enrollmentId?"
        component={ApiParticulier}
      />

      <PrivateRoute
        path="/api-impot-particulier-sandbox/:enrollmentId?"
        component={ApiImpotParticulierSandbox}
      />

      <PrivateRoute
        path="/api-impot-particulier-production/:enrollmentId?"
        component={ApiImpotParticulierProduction}
      />

      <PrivateRoute
        path="/api-impot-particulier-fc-sandbox/:enrollmentId?"
        component={ApiImpotParticulierFcSandbox}
      />

      <PrivateRoute
        path="/api-impot-particulier-fc-production/:enrollmentId?"
        component={ApiImpotParticulierFcProduction}
      />

      <PrivateRoute
        path="/api-r2p-sandbox/:enrollmentId?"
        component={ApiR2PSandbox}
      />

      <PrivateRoute
        path="/api-r2p-production/:enrollmentId?"
        component={ApiR2PProduction}
      />

      <PrivateRoute
        path="/api-ficoba-sandbox/:enrollmentId?"
        component={ApiFicobaSandbox}
      />

      <PrivateRoute
        path="/api-ficoba-production/:enrollmentId?"
        component={ApiFicobaProduction}
      />

      <PrivateRoute
        path="/franceconnect/:enrollmentId?"
        component={FranceConnect}
      />

      <PrivateRoute
        path="/aidants-connect/:enrollmentId?"
        component={AidantsConnect}
      />

      <PrivateRoute
        path="/api-droits-cnam/:enrollmentId?"
        component={ApiDroitsCnam}
      />

      <PrivateRoute
        path="/api-entreprise/:enrollmentId?"
        component={ApiEntreprise}
      />

      <PrivateRoute
        path="/le-taxi-clients/:enrollmentId?"
        component={LeTaxiClients}
      />

      <PrivateRoute
        path="/le-taxi-chauffeurs/:enrollmentId?"
        component={LeTaxiChauffeurs}
      />

      <PrivateRoute path="/cartobio/:enrollmentId?" component={CartoBio} />

      <PrivateRoute
        path="/api-service-national/:enrollmentId?"
        component={ApiServiceNational}
      />

      <PrivateRoute
        path="/api-hermes-sandbox/:enrollmentId?"
        component={ApiHermesSandbox}
      />

      <PrivateRoute
        path="/api-hermes-production/:enrollmentId?"
        component={ApiHermesProduction}
      />

      <PrivateRoute
        path="/api-e-contacts-sandbox/:enrollmentId?"
        component={ApiEContactsSandbox}
      />

      <PrivateRoute
        path="/api-e-contacts-production/:enrollmentId?"
        component={ApiEContactsProduction}
      />

      <PrivateRoute
        path="/api-opale-sandbox/:enrollmentId?"
        component={ApiOpaleSandbox}
      />

      <PrivateRoute
        path="/api-opale-production/:enrollmentId?"
        component={ApiOpaleProduction}
      />

      <PrivateRoute
        path="/api-mire-sandbox/:enrollmentId?"
        component={ApiMireSandbox}
      />

      <PrivateRoute
        path="/api-mire-production/:enrollmentId?"
        component={ApiMireProduction}
      />

      <PrivateRoute
        path="/api-ocfi-sandbox/:enrollmentId?"
        component={ApiOcfiSandbox}
      />

      <PrivateRoute
        path="/api-ocfi-production/:enrollmentId?"
        component={ApiOcfiProduction}
      />

      <PrivateRoute
        path="/api-e-pro-sandbox/:enrollmentId?"
        component={ApiEProSandbox}
      />

      <PrivateRoute
        path="/api-e-pro-production/:enrollmentId?"
        component={ApiEProProduction}
      />

      <PrivateRoute
        path="/api-robf-sandbox/:enrollmentId?"
        component={ApiRobfSandbox}
      />

      <PrivateRoute
        path="/api-robf-production/:enrollmentId?"
        component={ApiRobfProduction}
      />

      <PrivateRoute
        path="/api-cpr-pro-sandbox/:enrollmentId?"
        component={ApiCprProSandbox}
      />

      <PrivateRoute
        path="/api-cpr-pro-production/:enrollmentId?"
        component={ApiCprProProduction}
      />

      <PrivateRoute
        path="/api-infinoe-sandbox/:enrollmentId?"
        component={ApiInfinoeSandbox}
      />

      <PrivateRoute
        path="/api-infinoe-production/:enrollmentId?"
        component={ApiInfinoeProduction}
      />

      <PrivateRoute
        path="/api-tiers-de-prestation/:enrollmentId?"
        component={ApiTiersDePrestation}
      />

      <PrivateRoute
        path="/api-declaration-cesu/:enrollmentId?"
        component={ApiDeclarationCesu}
      />

      <PrivateRoute
        path="/api-declaration-auto-entrepreneur/:enrollmentId?"
        component={ApiDeclarationAutoEntrepreneur}
      />

      <PrivateRoute path="/hubee/:enrollmentId?" component={Hubee} />

      <PrivateRoute
        path="/api-pro-sante-connect/:enrollmentId?"
        component={ApiProSanteConnect}
      />

      <PrivateRoute
        path="/api-indemnites-journalieres-cnam/:enrollmentId?"
        component={ApiIndemnitesJournalieresCnam}
      />

      <PrivateRoute
        path="/api-systeme-immatriculation-vehicules/:enrollmentId?"
        component={ApiSystemeImmatriculationVehicules}
      />

      <PrivateRoute
        path="/copy-authorization-request/:enrollmentId"
        component={CopyEnrollment}
      />

      <PrivateRoute
        path="/authorization-request/:enrollmentId"
        component={Enrollment}
      />

      <PrivateRoute path="/admin" component={Admin} />
    </>
  );
};

export default withUser(Routes);
