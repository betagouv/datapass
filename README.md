# DataPass [![Frontend build](https://github.com/betagouv/datapass/actions/workflows/front.yml/badge.svg)](https://github.com/betagouv/datapass/actions/workflows/front.yml) [![Backend CI](https://github.com/betagouv/datapass/actions/workflows/back.yml/badge.svg)](https://github.com/betagouv/datapass/actions/workflows/back.yml)

L’outil de gestion des habilitations juridiques pour les données à accès restreint.

![DataPass](screenshot-datapass.png)

## Contexte

### Le problème

Lorsqu’une administration expose des données à caractère personnel, elle doit pouvoir interdire leur diffusion aux organisations qui n’ont pas le droit d’y accéder. Par exemple, une agence de voyage n’a pas à connaître le revenu fiscal de référence de ses clients.

Pour cela, la plupart des administrations qui fournissent des données demandent aux entités souhaitant exploiter ces données de signer des conventions pour organiser l’échange.

Mais comment les collectivités territoriales peuvent-elles, dans ces conditions, avoir accès au fameux revenu fiscal de référence sachant qu’elles sont par ailleurs tenues de ne plus de demander ces informations à leurs administrés (cf. [Article L114-8 du CRPA](https://www.legifrance.gouv.fr/affichCode.do;jsessionid=EA87CA618644F6B9C1A66E4468F81BFD.tplgfr38s_3?idSectionTA=LEGISCTA000031367410&cidTexte=LEGITEXT000031366350&dateTexte=20161009)) ?

Doivent-elles signer des conventions avec chacune des administrations productrices de données avec potentiellement des règles et des procédures différentes chez chacun ? Il est probable que la multiplicité des conventions aboutissent purement et simplement à la non-circulation des données. Ceci implique in-fine que chaque citoyen doit continuer à fournir une photocopie de son avis d’imposition à sa mairie pour remplir ses démarches administratives annuelles.

### La solution

La DINUM simplifie radicalement ce processus. Dans un premier temps, elle a travaillé sur la mise en place d’un cadre juridique commun pour harmoniser et fluidifier les relations entre fournisseurs de données et fournisseurs de service. C’est la mise en place de l’article de la section [« Échange de données entre administrations » (L114-8 et suivants) du CRPA](https://www.legifrance.gouv.fr/affichCode.do;jsessionid=EA87CA618644F6B9C1A66E4468F81BFD.tplgfr38s_3?idSectionTA=LEGISCTA000031367410&cidTexte=LEGITEXT000031366350&dateTexte=20161009).

Dans un deuxième temps, la DINUM a mis en place un outil pour faciliter cette mise en relation entre fournisseur et consommateur : DataPass. Cet outil s’adresse aux ayants droits qui souhaiteraient exploiter des données à caractère personnel. DataPass délivre des habilitations, à travers un parcours simple, standardisé et conforme, pour accéder à l’ensemble des données protégées produites par l’État.

Le code de cet outil est [ouvert](https://guides.etalab.gouv.fr/logiciels/#clarifier-quels-degres-d-ouverture-pour-les-codes-sources).

## Fonctionnalités de DataPass

Pour le demandeur d’accès aux « données » :

- centralisation des habilitations pour les administrations à plusieurs API (et pour tout autre type d’organisation, aussi bien publique que privée)
- accès aux API Managers avec le même compte que celui utilisé pour demander l’accès à l’outil DataPass (SSO)
- gestion du renouvellement des habilitations
- sélection des périmètres de données (scopes) dans chaque API
- automatisation de la délivrance des jetons grâce à une interaction vers l’API Manager de votre organisation
- notification par mail du Délégué à la protection des données et du responsable de traitement de votre organisation lors de la validation d’une demande

Pour l’instructeur de la demande d’accès aux « données » :

- notification par mail à chaque nouvelle demande d’un demandeur
- automatisation de la création des comptes d’accès aux API Manager
- automatisation de la création des jetons grâce à une interaction avec les API Manager
- publication des habilitations validées sur https://datapass.api.gouv.fr/public conformément au RGPD
- pilotage de l’activité/tableau de bord statistique : https://datapass.api.gouv.fr/stats

## Raccorder son service à DataPass

### Définition des besoins

Si vous délivrez un service qui requiert une habilitation (ex : API délivrant des données
à caractère personnel) vous pouvez utiliser DataPass pour la gestion des habilitations nécessaires à l’accès aux « données ». DataPass
remplace les conventionnements multipartites entre organisations et de ce fait
participe activement au déploiement du « dites le nous une fois ». À noter que la gestion du
jeton d’accès n’est pas pris en charge directement par DataPass, c'est l’API manager qui s’en charge.
Seule la gestion de l’habilitation juridique en amont est gérée par DataPass.

La première étape du raccordement est de prendre contact avec notre équipe par mail à
contact@api.gouv.fr.

Nous vous recommanderons ensuite de réfléchir à une publication d’une fiche descriptive de votre API sur api.gouv.fr ([plus d’infos](https://public.3.basecamp.com/p/NtuWxsR6qk5spyEXRtzA5piP)).

Ensuite nous établirons ensemble le contenu du formulaire d’habilitation qui correspond le mieux
à votre service. Par exemple, nous établirons ensemble s’il y a besoin de proposer une granularité
d’accès aux données ou un bloc RGPD si vous exposez des données personnelles.

### Déploiement du formulaire

À partir d’éléments communs, nous développons et déployons un formulaire sur mesure. Voici la liste
des informations à déterminer ensemble (ainsi que les fichiers à modifier dans le code de DataPass) :

1. dans le frontend
   1. description de l’organisation du formulaire (création de src/pages/NameOfApi.js)
   2. url du formulaire sur le domaine datapass.api.gouv.fr (src/Routes.js)
   3. label à afficher pour le service dans la vue liste (src/lib/api.js)
   4. [optionnel] codes organisation (codes NAF) valides pour votre service (src/lib/index.js L~38)
   5. [optionnel] une page de présentation hors connection
2. dans le backend
   1. définition du format et du type des données hors tronc commun (création de
      app/policies/enrollment/<name_of_api>\_policy.rb)
   2. définitions de règles de validation supplémentaires et des messages d’erreurs spécifiques
      (création de app/models/enrollment/<name_of_api>.rb)
   3. configuration du label de service et de l’adresse email pour les notifications mails émises
      depuis DataPass. À noter, que l’envoi par DataPass via une adresse email administrée par vous fait
      l’object d’une procédure de validation effectuée par notre équipe dans l’outil mailjet
      (config/data_providers.yml)
   4. [optionnel] définition d’une action spécifique post validation (ex : création d’un espace
      développeur dans l’API Manager via appel HTTP directement sur votre API Manager)
      (app/models/enrollment.rb L51)
   5. [optionnel] modèle d’email de réponse personnalisés

### Traitement des demandes

Enfin, nous définirons ensemble les modalités de validation de vos demandes d’habilitations.
Plusieurs méthodes sont envisageables :

- Le producteur valide toutes les demandes de manière autonome
- La DINUM valide les demandes dites passantes (cas d’usage prédéfinis) et soumet à validation du
  fournisseur les autres cas
- Le producteur de données délègue intégralement la validation des accès à la DINUM

### Interfaçage entre DataPass et un API Manager

[![Diagramme de flux](https://docs.google.com/drawings/d/e/2PACX-1vSFtKMTR1-NNUWa3Edd9Pnji4MSwhBLkaO2nq7t7B_kGerTSkWz7CzcxQ8FHArLviX0kZEzua5xd7Su/pub?w=2338&h=924)](https://docs.google.com/drawings/d/1FUd7ko-7GkMyy_JwqLBtjswQO_lycUg3591WRZSx8hw/edit?usp=sharing)

## Les roles dans DataPass

Dans DataPass, il y a différents types d’utilisateurs :

- **les demandeurs :** ils viennent déposer leur demande d’accès, ils n’ont accès qu’a leur demandes.
- **les instructeurs :** ils peuvent valider, refuser ou demander des modifications des demandes qu’ils
  ont à charge.
- **les rapporteurs :** ils voient, en plus de leurs propres demandes, toutes les demandes déposées pour
  leur service.
- **les abonnés :** ils reçoivent une notification par mail à chaque fois qu’un demandeur dépose une
  nouvelle demande pour leur service.

Ces types sont combinables pour débloquer plus ou moins de fonctionnalités : par exemple un utilisateur qui
serait à la fois « rapporteur » et « abonné » pour une API donnée, est notifié par email d’une nouvelle
demande pour cette API et peut consulter la demande en question. Pour autant, il ne peut pas la valider.

À noter que les instructeurs, rapporteurs et abonnés ont une page d’accueil différente des demandeurs.
Cette page d’accueil ajoute notamment des fonctions de recherche et de filtre des demandes qui ne sont pas
disponibles aux demandeurs.

Pour devenir instructeur, rapporteur ou abonné pour un type de demande il faut :

1. se créer un compte sur https://auth.api.gouv.fr/users/sign-up
2. rejoindre l’organisation que l’on représente en renseignant son numéro SIRET
3. envoyer une demande écrite à datapass@api.gouv.fr

## Tester DataPass

Si vous avez besoin de faire le parcours de validation complet pour bien comprendre le fonctionnement
de DataPass, vous pouvez utiliser notre plateforme de « staging ». Cette plateforme est disponible ici :
https://datapass-staging.api.gouv.fr/ (lien direct vers une demande API Particulier :
https://datapass-staging.api.gouv.fr/api-particulier).

Vous pouvez vous créer un compte utilisateur en entrant n’importe quel numéro SIRET.

Vous pouvez également utiliser les comptes de tests suivants :

- instructeur API Entreprise :
  - identifiant : api-entreprise@yopmail.com
  - mot de passe : api-entreprise@yopmail.com
- instructeur API Particulier :
  - identifiant : api-particulier@yopmail.com
  - mot de passe : api-particulier@yopmail.com
- utilisateur sans droits :
  - identifiant : user@yopmail.com
  - mot de passe : user@yopmail.com

À noter que les emails reçus sur les adresses en yopmail.com sont accessibles sur : http://yopmail.com/.

## Contenu de ce dépôt de code

Ce dépôt de code contient les scripts de configuration et de déploiement pour
déployer les services :

- datapass.api.gouv.fr
- auth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

En outre, il vous permet d’instancier un environnement de développement local pour ces services.
Pour ce faire merci de prendre connaissance de la suite du document (en anglais).

## Installation

### DataPass front only

This first installation method use the remote backend available
at https://back.datapass-test.api.gouv.fr. This is the simplest and fastest
installation method, but you will not be able to make development on the
backend.

First, install NodeJs version >=16.

Then, clone the repository and install npm dependencies:

```
git clone git@github.com:betagouv/datapass.git
cd datapass/signup-front
npm i
```

Last, launch the server:

```
npm run dev-with-remote-backend
```

### DataPass back & front with Docker

This installation method use a backend launched locally with docker. This method
is longer and more complex than the first method, but you will be able to make
development on the backend.

#### Dependencies setup

- [Docker 20.10.8](https://www.docker.com/)
- [Docker compose 1.29.2](https://docs.docker.com/compose/install/)
- [Ansible 2.9.10](https://www.ansible.com/)
- [NodeJS >=16](https://nodejs.org/)

#### Local environment

Clone the repo:

```bash
git clone git@github.com:betagouv/datapass.git
cd datapass
```

Ask a colleague to give you the backend secrets stored in
the `signup-back/.env.local` file.

Then create and configure your backend docker containers:

```bash
docker-compose up # This can take a while, go make a loaf of bread or something
```

And finally, you can start the frontend:

```bash
cd signup-front
npm install
npm run dev
```

#### Test your installation

Go to http://localhost:3000/. Sign in as `user@yopmail.com` with the
password `user@yopmail.com`. Then, you should see the enrollment list. Note that
test instructor emails can be
found [here](https://github.com/betagouv/api-auth/blob/master/scripts/fixtures.sql)
.

#### Front end linter

Note that, we use the [`prettier`](https://prettier.io) linter for signup-front.
Please configure your IDE accordingly: https://prettier.io/docs/en/editors.html.

### API Auth (optional)

#### Dependencies setup

- [Ansible 2.9.10](https://www.ansible.com/)
- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS

#### Local environment

Clone the repo:

```bash
git clone git@github.com:betagouv/datapass.git
```

Add the following hosts in `/etc/hosts`:

```text
192.168.56.127 auth-development.particulier-infra.api.gouv.fr
192.168.56.127 auth-development.api.gouv.fr
```

Then create and configure your virtual machine:

```bash
vagrant up api-auth # This can take a while, go make a loaf of bread or something
```

> **If you are using macOS.**
> The host's `/etc/hosts` configuration file may not take effect in the guest machines.
> You might need to also alter the guest machine's `/etc/hosts` after running vagrant up.
> Connect to each guest machine

```bash
vagrant ssh api-auth
```

> And copy your hosts to `/etc/hosts`

> **If you are using macOS Catalina 10.15**
> Vagrant encounters the following error :
> `NFS is reporting that your exports file is invalid`
> You must change your source folder in your Vagrantfile as described [here](https://github.com/hashicorp/vagrant/issues/10961#issuecomment-538906659)

#### Interactive mode

```bash
vagrant ssh api-auth
sudo systemctl stop api-auth
sudo su - api-auth
cd /opt/apps/api-auth/current
export $(cat /etc/api-auth.conf | xargs)
npm start
```

Optional, you can also run api-auth in debug mode:

```
DEBUG=oidc-provider:* npm start
```

### DataPass back & front with Vagrant (optional)

This installation method use a backend launched locally within a Vagrant virtual
machine. This method is much longer and more complex than the previous ones, but
it provides a development environment very close to the production environment
allowing you to both work on provisioning and applications. It is configured to
run with a local installation of api-auth in a Vagrant virtual machine.

#### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.9.10](https://www.ansible.com/)

#### Installation

Clone the repo:

```bash
git clone git@github.com:betagouv/datapass.git
```

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 datapass-development.particulier-infra.api.gouv.fr
192.168.56.125 datapass-development.api.gouv.fr
192.168.56.125 back.datapass-development.api.gouv.fr
```

Then create and configure your virtual machine:

```bash
vagrant up datapass # This can take up to 30 minutes
```

At this point you got a complete environment running. But you may want to run
the different application interactively.

#### Signup Front in interactive mode

You will run DataPass frontend locally and use the backend in the virtual
machine.

Additional dependencies setup:

- nodejs ^16.9

Tel your backend to listen from localhost:

```
ansible-playbook -i ./inventories/development --vault-password-file ~/.ssh/datapass_ansible_vault configure.yml -t back -e "front_host=http://localhost:3000"
```

Start the app in the interactive mode:

```
cd signup-front
REACT_APP_BACK_HOST=https://back.datapass-development.api.gouv.fr npm run dev
```

#### Signup Back

You will run DataPass backend interactively in the virtual machine.

```bash
vagrant ssh datapass
sudo systemctl stop signup-back
sudo su - signup
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
PG_HOST=localhost REDIS_URL=redis://localhost:6379 RAILS_ENV=development rails s
```

### Production-like deployment (optional)

For development purpose you may want to have a local iso-production application
running instead of deployment through NFS. You can do it by running the
deployment script instead of processing to a development deployment:

```bash
ansible-playbook -i inventories/development deploy.yml
```

## Global architecture

### Functional architecture

[![functional architecture](https://docs.google.com/drawings/d/e/2PACX-1vTaMlby_wfIpW23-kJyTB5eBK8nZDI2sESM1ameo_1cJmlbNoC_9-EN45eUu-6yhUl6SKgm_3SXLkft/pub?w=1136&h=1112)](https://docs.google.com/drawings/d/11sVVz73uL1GBST5q1iykPQ40CgaN33MhETPeHesmslI/edit?usp=sharing)

### Technical architecture

[![technical architecture](https://docs.google.com/drawings/d/e/2PACX-1vRQgClO24uIMZMY-7DZCqz2QqaaDUjepysMv2zHEY4hrOkgGTz8FFXBMxNnNR-uD3F-ZknXHeHbksCj/pub?w=960&h=903)](https://docs.google.com/drawings/d/1rJl6g-BFKO--4EWmbSgn3Wq7H8LCxDUvey_xlN-3Sp4/edit?usp=sharing)

## Troubleshooting

### Unable to join organization on development environment

The incrementation of organization id might not have been done properly when
loading fixtures in api-auth database.

You can fix this in api-auth database with:

```postgres-sql
SELECT setval('organizations_id_seq', 3);
```

Powered
by: [<img src="http://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="100"/>](https://www.browserstack.com/)
