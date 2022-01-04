import React, { useLayoutEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import PublicEnrollmentList from './components/templates/PublicEnrollmentList';
import Stats from './components/templates/Stats';
import Accessibilite from './components/templates/Accessibilite';
import PrivateRoute from './components/organisms/PrivateRoute';
import { isEmpty } from 'lodash';
import AdminEnrollmentList from './components/templates/InstructorEnrollmentList';
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
import LeTaxi from './pages/LeTaxi';
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
import HubeePortail from './pages/HubeePortail';
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
import ApiHistovec from './pages/ApiHistovec';
import ApiPrestationsSociales from './pages/ApiPrestationsSociales';
import ApiPrestationsSocialesFc from './pages/ApiPrestationsSocialesFc';
import ApiEnsuDadSandbox from './pages/DgfipPages/ApiEnsuDadSandbox';
import ApiEnsuDadProduction from './pages/DgfipPages/ApiEnsuDadProduction';
import ApiIngresNomenclatures from './pages/ApiIngresNomenclatures';
import ApiIngresNoyau from './pages/ApiIngresNoyau';

export const Routes = ({ user }) => {
  const location = useLocation();

  useLayoutEffect(() => window.scrollTo(0, 0), [location.pathname]);

  return (
    <>
      <Route path="/public/:targetApi?" children={<PublicEnrollmentList />} />

      <Route path="/stats/:targetApi?" children={<Stats />} />

      <Route path="/accessibilite" children={<Accessibilite />} />

      <Route path="/faq" children={<FAQ />} />

      <PrivateRoute
        exact
        path="/"
        children={
          user && isEmpty(user.roles) && user.organizations.length < 5 ? (
            <UserEnrollmentList />
          ) : (
            <AdminEnrollmentList />
          )
        }
      />

      <PrivateRoute
        path="/api-particulier/:enrollmentId?"
        children={<ApiParticulier />}
      />

      <PrivateRoute
        path="/api-impot-particulier-sandbox/:enrollmentId?"
        children={<ApiImpotParticulierSandbox />}
      />

      <PrivateRoute
        path="/api-impot-particulier-production/:enrollmentId?"
        children={<ApiImpotParticulierProduction />}
      />

      <PrivateRoute
        path="/api-impot-particulier-fc-sandbox/:enrollmentId?"
        children={<ApiImpotParticulierFcSandbox />}
      />

      <PrivateRoute
        path="/api-impot-particulier-fc-production/:enrollmentId?"
        children={<ApiImpotParticulierFcProduction />}
      />

      <PrivateRoute
        path="/api-r2p-sandbox/:enrollmentId?"
        children={<ApiR2PSandbox />}
      />

      <PrivateRoute
        path="/api-r2p-production/:enrollmentId?"
        children={<ApiR2PProduction />}
      />

      <PrivateRoute
        path="/api-ficoba-sandbox/:enrollmentId?"
        children={<ApiFicobaSandbox />}
      />

      <PrivateRoute
        path="/api-ficoba-production/:enrollmentId?"
        children={<ApiFicobaProduction />}
      />

      <PrivateRoute
        path="/franceconnect/:enrollmentId?"
        children={<FranceConnect />}
      />

      <PrivateRoute
        path="/aidants-connect/:enrollmentId?"
        children={<AidantsConnect />}
      />

      <PrivateRoute
        path="/api-droits-cnam/:enrollmentId?"
        children={<ApiDroitsCnam />}
      />

      <PrivateRoute
        path="/api-entreprise/:enrollmentId?"
        children={<ApiEntreprise />}
      />

      <PrivateRoute path="/le-taxi/:enrollmentId?" children={<LeTaxi />} />

      <PrivateRoute path="/cartobio/:enrollmentId?" children={<CartoBio />} />

      <PrivateRoute
        path="/api-service-national/:enrollmentId?"
        children={<ApiServiceNational />}
      />

      <PrivateRoute
        path="/api-hermes-sandbox/:enrollmentId?"
        children={<ApiHermesSandbox />}
      />

      <PrivateRoute
        path="/api-hermes-production/:enrollmentId?"
        children={<ApiHermesProduction />}
      />

      <PrivateRoute
        path="/api-e-contacts-sandbox/:enrollmentId?"
        children={<ApiEContactsSandbox />}
      />

      <PrivateRoute
        path="/api-e-contacts-production/:enrollmentId?"
        children={<ApiEContactsProduction />}
      />

      <PrivateRoute
        path="/api-opale-sandbox/:enrollmentId?"
        children={<ApiOpaleSandbox />}
      />

      <PrivateRoute
        path="/api-opale-production/:enrollmentId?"
        children={<ApiOpaleProduction />}
      />

      <PrivateRoute
        path="/api-mire-sandbox/:enrollmentId?"
        children={<ApiMireSandbox />}
      />

      <PrivateRoute
        path="/api-mire-production/:enrollmentId?"
        children={<ApiMireProduction />}
      />

      <PrivateRoute
        path="/api-ocfi-sandbox/:enrollmentId?"
        children={<ApiOcfiSandbox />}
      />

      <PrivateRoute
        path="/api-ocfi-production/:enrollmentId?"
        children={<ApiOcfiProduction />}
      />

      <PrivateRoute
        path="/api-e-pro-sandbox/:enrollmentId?"
        children={<ApiEProSandbox />}
      />

      <PrivateRoute
        path="/api-e-pro-production/:enrollmentId?"
        children={<ApiEProProduction />}
      />

      <PrivateRoute
        path="/api-robf-sandbox/:enrollmentId?"
        children={<ApiRobfSandbox />}
      />

      <PrivateRoute
        path="/api-robf-production/:enrollmentId?"
        children={<ApiRobfProduction />}
      />

      <PrivateRoute
        path="/api-cpr-pro-sandbox/:enrollmentId?"
        children={<ApiCprProSandbox />}
      />

      <PrivateRoute
        path="/api-cpr-pro-production/:enrollmentId?"
        children={<ApiCprProProduction />}
      />

      <PrivateRoute
        path="/api-infinoe-sandbox/:enrollmentId?"
        children={<ApiInfinoeSandbox />}
      />

      <PrivateRoute
        path="/api-infinoe-production/:enrollmentId?"
        children={<ApiInfinoeProduction />}
      />

      <PrivateRoute
        path="/api-tiers-de-prestation/:enrollmentId?"
        children={<ApiTiersDePrestation />}
      />

      <PrivateRoute
        path="/api-declaration-cesu/:enrollmentId?"
        children={<ApiDeclarationCesu />}
      />

      <PrivateRoute
        path="/api-declaration-auto-entrepreneur/:enrollmentId?"
        children={<ApiDeclarationAutoEntrepreneur />}
      />

      <PrivateRoute
        path="/hubee-portail/:enrollmentId?"
        children={<HubeePortail />}
      />

      <PrivateRoute
        path="/api-pro-sante-connect/:enrollmentId?"
        children={<ApiProSanteConnect />}
      />

      <PrivateRoute
        path="/api-indemnites-journalieres-cnam/:enrollmentId?"
        children={<ApiIndemnitesJournalieresCnam />}
      />

      <PrivateRoute
        path="/api-systeme-immatriculation-vehicules/:enrollmentId?"
        children={<ApiSystemeImmatriculationVehicules />}
      />

      <PrivateRoute
        path="/copy-authorization-request/:enrollmentId"
        children={<CopyEnrollment />}
      />

      <PrivateRoute
        path="/authorization-request/:enrollmentId"
        children={<Enrollment />}
      />

      <PrivateRoute
        path="/api-histovec/:enrollmentId?"
        children={<ApiHistovec />}
      />

      <PrivateRoute
        path="/api-prestations-sociales/:enrollmentId?"
        children={<ApiPrestationsSociales />}
      />

      <PrivateRoute
        path="/api-prestations-sociales-fc/:enrollmentId?"
        children={<ApiPrestationsSocialesFc />}
      />

      <PrivateRoute
        path="/api-ensu-dad-sandbox/:enrollmentId?"
        children={<ApiEnsuDadSandbox />}
      />

      <PrivateRoute
        path="/api-ensu-dad-production/:enrollmentId?"
        children={<ApiEnsuDadProduction />}
      />

      <PrivateRoute
        path="/api-ingres-nomenclatures/:enrollmentId?"
        children={<ApiIngresNomenclatures />}
      />

      <PrivateRoute
        path="/api-ingres-noyau/:enrollmentId?"
        children={<ApiIngresNoyau />}
      />

      <PrivateRoute path="/admin" children={<Admin />} />
    </>
  );
};

export default withUser(Routes);
