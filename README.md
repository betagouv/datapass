# Data Pass (anciennement Signup)

L'outil de gestion des habilitations administratives.

![Data Pass](screenshot-datapass.png)

## Contexte

D'une part, toutes les administrations (ministères, opérateurs, collectivités, ...) produisent des
API pour exposer leurs ressources (données ou traitements). Une partie de ces administrations
utilise des gestionnaires d'API (API manager en anglais) pour centraliser l'exposition de leurs
ressources. Les outils du marché permettent de donner accès aux éléments techniques d’une ou
plusieurs API mais ne gèrent pas la phase d’habilitation.

D'autre part, les administrations consomment souvent plusieurs API (de différents producteurs) pour
mettre en oeuvre un téléservice ou une nouvelle démarche. L’utilisation d’un outil interministériel
leur permet une cohérence de la procédure d’habilitation et la centralisation de leurs demandes.

Ces constats ont amené la DINUM à créer, d’abord pour ses propres besoins, puis pour plusieurs
ministères un outil d’habilitation spécifique aux demandes d’accès à des API. Cet outils est appelé
Data Pass.

Le code de cet outil est [ouvert](https://guides.etalab.gouv.fr/logiciels/#clarifier-quels-degres-d-ouverture-pour-les-codes-sources).

## Fonctionnalités de Data Pass

Pour le demandeur d'accès aux « données » :

- centralisation des habilitations pour les administrations à plusieurs API (et pour tout autre type d'organisation, aussi bien publique que privée)
- accès aux API Managers avec le même compte que celui utilisé pour demander l’accès à l'outil Data Pass (SSO)
- gestion du renouvellement des habilitations
- sélection des périmètres de données (scopes) dans chaque API
- automatisation de la délivrance des tokens grâce à une interaction vers l’API Manager de votre organisation
- notification par mail du Délégué à la protection des données et du responsable de traitement de votre organisation lors de la validation d’une demande

Pour le valideur de la demande d'accès aux « données » :

- notification par mail à chaque nouvelle demande d'un demandeur
- automatisation de la création des comptes d’accès aux API Manager
- automatisation de la création des tokens grâce à une interaction avec les API Manager
- publication des habilitations validées sur https://datapass.api.gouv.fr/public conformément au RGPD
- pilotage de l’activité/tableau de bord statistique : https://datapass.api.gouv.fr/stats

## Raccorder son service à Data Pass

### Définition des besoins

Si vous délivrez un service qui requiert une habilitation (ex: API délivrant des données
à caractère personnel) vous pouvez utiliser Data Pass pour la gestion des habilitations nécessaires à l'accès aux « données ». Data Pass
remplace les conventionnements multipartites entre organisations et de ce fait
participe activement au déploiement du « dites le nous une fois ». À noter que la gestion du
jeton d'accès n'est pas pris en charge directement par Data Pass, c'est l'API manager qui s'en charge.
Seule la gestion de l'habilitation en amont est gérée par Data Pass.

La première étape du raccordement est de prendre contact avec notre équipe par mail à
contact@api.gouv.fr.

Ensuite nous établirons ensemble le contenu du formulaire d'habilitation qui correspond le mieux
à votre service. Par exemple, nous établirons ensemble si il y a besoin de proposer une granularité
d'accès aux données ou un bloc RGPD si vous exposez des données personnelles.

### Déploiement du formulaire

A partir d'élément communs, nous développons et déployons un formulaire sur mesure. Voici la liste
des informations à déterminer ensemble (ainsi que les fichiers à modifier dans le code de Data Pass) :

1. dans le frontend
    1. description de l'organisation du formulaire (création de src/pages/NameOfApi.js)
    2. url du formulaire sur le domaine datapass.api.gouv.fr (src/App.js)
    3. label à afficher pour le service dans la vue liste (src/lib/api.js)
    4. [optionnel] codes organisation (codes NAF) valides pour votre service (src/lib/index.js L~38)
2. dans le backend
    1. définition du format et du type des données hors tronc commun (création de
    app/policies/enrollment/<name_of_api>_policy.rb)
    2. définitions de règles de validation supplémentaires et des messages d'erreurs spécifiques
    (création de app/models/enrollment/<name_of_api>.rb)
    3. configuration du label de service et de l'adresse email pour les notifications mail émises
    depuis Data Pass. À noter, que l'envoi par Data Pass via une adresse email administré par vous fait
    l'object d'une procédure de validation effectuée par notre équipe dans l'outils mailjet
    (app/mailers/enrollment_mailer.rb)
    4. [optionnel] définition d'une action spécifique post validation (ex : création d'un espace
    développeur dans l'API Manager via appel HTTP directement sur votre API Manager)
    (app/models/enrollment.rb L51)

### Traitement des demandes

Enfin, nous définirons ensemble les modalités de validation de vos demandes d'habilitations.
Plusieurs méthodes sont envisageables :

- Le producteur valide toutes les demandes de manière autonome
- La DINUM valide les demandes dites passantes (cas d'usage prédéfinis) et soumet à validation du
fournisseur les autres cas
- Le producteur de données délègue intégralement la validation des accès à la DINUM

## Devenir administrateur de son service dans Data Pass

Dans Data Pass il y a deux types d'utilisateurs, les demandeurs, qui viennent déposer leur demande, et
les administrateurs, qui peuvent les valider, les refuser ou demander des modifications. Les
administrateurs voient, en plus de leurs propres demandes, toutes les demandes déposées pour leur
service. Les administrateurs ont une page d'acceuil différente des demandeurs. Cette page d'acceuil
ajoute notamment des fonction de recherche et de filtre des demandes qui ne sont pas disponibles
aux demandeurs.

Pour devenir administrateur il faut :

1. se créer un compte sur https://auth.api.gouv.fr/users/sign-up
2. rejoindre l'organisation que l'on représente en renseignant son numéro SIRET
3. envoyer une demande écrite à datapass@api.gouv.fr

## Tester Data Pass

Si vous avez besoin de faire le parcours de validation complet pour bien comprendre le fonctionnement
de Data Pass, vous pouvez utiliser notre plateforme de staging. Cette plateforme est disponible ici :
https://datapass-staging.api.gouv.fr/ (lien direct vers une demande API Particulier :
https://datapass-staging.api.gouv.fr/api-particulier).

Vous pouvez vous créer un compte utilisateur en entrant n'importe quel numéro SIRET.

Vous pouvez également utiliser les comptes de tests suivants :

- validateur api-particulier :
    - identifiant : api-particulier@yopmail.com
    - mot de passe : api-particulier@yopmail.com
- utilisateur sans droits d'administration :
    - identifiant : user@yopmail.com
    - mot de passe : user@yopmail.com

À noter que les emails reçus sur les adresses en yopmail.com sont accessibles sur : http://yopmail.com/ .

## Contenu de ce dépôt de code

Ce dépôt de code contient les scripts de configuration et de déploiement pour
déployer les services :

- datapass.api.gouv.fr
- auth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

En outre, il vous permet d'instancier un environnement de développement local pour ces services.
Pour ce faire merci de prendre connaissance de la suite du document (en anglais).

## Install

### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.9.10](https://www.ansible.com/)

### Data Pass local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.com:etalab/api.gouv.fr/datapass.git
cd datapass/
git submodule foreach git fetch
git submodule foreach git pull origin master
git submodule foreach git checkout master
```

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 datapass-development.particulier-infra.api.gouv.fr
192.168.56.125 datapass-development.api.gouv.fr
192.168.56.125 back.datapass-development.api.gouv.fr

192.168.56.127 auth-development.particulier-infra.api.gouv.fr
192.168.56.127 auth-development.api.gouv.fr
```

Then install ansible dependencies:

```bash
ansible-galaxy install -r requirements.yml
```

> **If you are using macOS.**
> The host's `/etc/hosts` configuration file may not take effect in the guest machines.
> You might need to also alter the guest machine's `/etc/hosts` after running vagrant up.
> Connect to each guest machine
```bash
vagrant ssh [vm-name]
```
> And copy your hosts to `/etc/hosts`

Then configure your virtual machine:
```bash
vagrant up
ansible-playbook -i inventories/development configure.yml # This can take a while, go make a loaf of bread or something
```

> **If you are using macOS Catalina 10.15**
> Vagrant encounters the following error :
> `NFS is reporting that your exports file is invalid`
> You must change your source folder in your Vagrantfile as described [here](https://github.com/hashicorp/vagrant/issues/10961#issuecomment-538906659)

### Development deployment

Deploy Data Pass backend:
```bash
vagrant ssh datapass
sudo su - signup
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
bundler install
eval "$(rbenv init -)"
rails db:migrate
rails db:seed
sudo systemctl restart signup-back
exit
exit
```

Load fixtures in Data Pass back:
```bash
vagrant ssh datapass
sudo su - postgres
psql -d signup-back -c 'ALTER TABLE "events" DISABLE TRIGGER ALL;ALTER TABLE "users" DISABLE TRIGGER ALL;ALTER TABLE "enrollments" DISABLE TRIGGER ALL;'
exit
sudo su - signup
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
rails db:fixtures:load
exit
sudo su - postgres
psql -d signup-back -c 'ALTER TABLE "events" ENABLE TRIGGER ALL;ALTER TABLE "users" ENABLE TRIGGER ALL;ALTER TABLE "enrollments" ENABLE TRIGGER ALL;'
exit
exit
```

Deploy Data Pass frontend:
```bash
vagrant ssh datapass
sudo su - signup
cd /opt/apps/signup-front/current
export $(cat /etc/signup-front.conf | xargs)
NODE_ENV=development npm i
npm run build
sudo systemctl restart signup-front
exit
exit
```

Deploy API Auth:
```bash
vagrant ssh api-auth
sudo su - api-auth
cd /opt/apps/api-auth/current
export $(cat /etc/api-auth.conf | xargs)
npm i
npm run build
 # load fixtures
npm run load-fixtures
sudo systemctl restart api-auth
exit
exit
```

### Test your installation

Go to https://datapass-development.api.gouv.fr/. Sign in as `user@yopmail.com` with the password `password`. Then, you should see the enrollment list.
Note that other credentials can be found [here](https://github.com/betagouv/api-auth/blob/master/scripts/fixtures.sql).

### Run the apps in interactive mode (optional)

If you want to launch interactively signup-front:
```bash
vagrant ssh datapass
sudo systemctl stop signup-front
sudo su - signup
cd /opt/apps/signup-front/current
export $(cat /etc/signup-front.conf | xargs)
npm run dev
```

If you experience trouble reloading, you might want to increase the file watcher limit in both the host and the guest: https://webpack.js.org/configuration/watch/#not-enough-watchers .

Note that, we use the [`prettier`](https://prettier.io) linter for signup-front. Please configure your IDE accordingly: https://prettier.io/docs/en/editors.html.

signup-back:
```bash
vagrant ssh datapass
sudo systemctl stop signup-back
sudo su - signup
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
RAILS_ENV=development rails s
```

api-auth:
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

### Production-like deployment (optional)

For development purpose you may want to have a local iso-production application running instead of deployment through NFS. You can do it by running the deployment script instead of processing to a development deployment:

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

The incrementation of organization id might not have been done properly when loading fixtures in api-auth database.

You can fix this in api-auth database with:

```postgres-sql
SELECT setval('organizations_id_seq', 3);
```

### Sync vagrant ruby env with host dev tools

You may want to connect your local dev tools with remote ruby env (ex: setup remote ruby interpreter in rubymine).

Add your vagrant insecure public key from:

```bash
vagrant ssh datapass
cat ~/.ssh/authorized_keys
```

in: `/home/signup/.ssh/authorized_keys`

Then you can use this key to configure ssh connection to: `ssh://signup@192.168.56.125:22/home/signup/.rbenv/versions/2.7.1/bin/ruby`

NB: if you want to run rubocop, you might need to install standardrb `gem install standardrb`.

### React dev tools keep disconnecting

Add the following lines in `/etc/nginx/sites-enabled/signup-front` at the end of the `location /` section :

```
    # the following two timeout rules fix CRA WDS disconnects after 60s
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
```

See this issue on github : https://github.com/facebook/create-react-app/issues/8203#issuecomment-571605090

### Slow hot reloading in signup-front

If you experience slow hot reloading in interactive mode for signup-front, execute this on your host AND on the datapass VM:

```shell script
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

More details here: https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers
