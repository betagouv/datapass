# Signup

L'outil de gestion des habilitations administratives.

![Signup](screenshot-signup.png)

## Contexte

Plusieurs ministères mettent en œuvre des API et des API managers. Les outils du marché permettent
de donner accès aux éléments techniques d’une ou plusieurs API mais ne gèrent pas la phase
d’habilitation.

De plus, les administrations utilisent souvent, pour un même service, plusieurs API. L’utilisation
d’un outil interministériel leur permet une cohérence de la procédure d’habilitation et la
centralisation de leurs demandes.

Ces constats ont amené la DINUM a créer, d’abord pour ses propres besoins, puis pour plusieurs
ministères un outil d’habilitation spécifique aux demandes d’accès à des API.

## Fonctionnalités de Signup

Pour le demandeur :

- centralisation des habilitations d’une organisation à plusieurs API
- sélection les périmètres de données (scope) dans chaque API
- information du DPO et du responsable de traitement lors de la validation d’une demande
- gestion du renouvellement des habilitations
- permet d’accéder aux APIm avec le même compte que celui utilisé pour demander l’accès au Signup
- permet une automatisation de la délivrance des tokens avec interaction vers l’API management des ministères

Pour le validateur :

- les utilisateurs sont prévenus par mail pour chaque nouvelle demande
- automatisation de la création des comptes d’accès aux API Manager
- automatisation de la création des tokens grâce par interaction avec les API Manager
- publication des autorisation délivrées
- pilotage de l’activité (tableau de bord statistique) 
- affichage public des fournisseurs de service autorisés

## Raccorder son service à Signup

### Définition des besoins

Si vous délivrez un service qui requiert une habilitation juridique (ex: API délivrant des données
à caractère personnel) vous pouvez utiliser Signup pour la gestion de vos habilitations. Signup
remplace les conventionnements bipartites ou tripartites entre administrations et de ce fait
participe activement au déploiement du « dites le nous une fois ». À noter que la gestion du
jeton d'accès n'est pas pris en charge par Signup, seule la gestion de l'habilitation en amont
l'est.

La première étape du raccordement est de prendre contact avec notre équipe par mail à
contact@api.gouv.fr.

Ensuite nous établirons ensemble le contenu du formulaire d'habilitation qui correspond au mieux
à votre service. Par exemple, nous établirons ensemble si il y a besoin de proposer une granularité
d'accès ou un bloc RGPD si vous exposez des données sensibles.

### Déploiement du formulaire

A partir d'élément communs, nous développons et déployons un formulaire sur mesure. Voici la liste
des informations à déterminer ensemble (ainsi que les fichiers à modifier dans le code de Signup) :

1. dans le frontend
    1. description de l'organisation du formulaire (création de src/pages/NameOfApi.js)
    2. url du formulaire sur le domaine signup.api.gouv.fr (src/App.js)
    3. label à afficher pour le service dans la vue liste (src/lib/api.js)
    4. [optionnel] codes organisation (codes NAF) valides pour votre service (src/lib/index.js L~38)
2. dans le backend
    1. définition du format et du type des données hors tronc commun (création de
    app/policies/enrollment/<name_of_api>_policy.rb)
    2. définitions de règles de validation supplémentaires et des messages d'erreurs spécifiques
    (création de app/models/enrollment/<name_of_api>.rb)
    3. configuration du label de service et de l'adresse email pour les notifications mail émises
    depuis Signup. À noter, que l'envoi par Signup via une adresse email administré par vous fait
    l'object d'une procédure de validation effectuée par notre équipe dans l'outils mailjet
    (app/mailers/enrollment_mailer.rb)
    4. [optionnel] définition d'une action spécifique post validation (ex : création d'un espace
    développeur dans l'API Manager via appel HTTP directement sur votre API Manager)
    (app/models/enrollment.rb L51)

### Traitement des demandes

Enfin, nous définirons ensemble les modalités de validation de vos demandes habilitations.
Plusieurs méthodes sont envisageables :

- Le producteur de données délègue intégralement la validation des accès à la DINUM
- La DINUM valide les demandes dites passantes (cas d'usage prédéfinis) et soumet à validation du
fournisseur les autres cas
- Le producteur valide les demandes de manière autonome

## Devenir administrateur de son service dans Signup

Dans Signup il y a deux types d'utilisateurs, les demandeurs, qui viennent déposer leur demande, et
les administrateurs, qui peuvent les valider, les refuser ou demander des modifications. Les
administrateurs voient, en plus de leurs propres demandes, toutes les demandes déposées pour leur
service. Les administrateurs ont une page d'acceuil différente des demandeurs. Cette page d'acceuil
ajoute notamment des fonction de recherche et de filtre des demandes qui ne sont pas disponibles
aux demandeurs.

Pour devenir administrateur il faut :

1. se créer un compte sur https://auth.api.gouv.fr/users/sign-up
2. rejoindre l'organisation que l'on représente en renseignant son numéro SIRET
3. envoyer une demande écrite à signup@api.gouv.fr

## Tester Signup

Si vous avez besoin de faire le parcours de validation complet pour bien comprendre le fonctionnement
de Signup, vous pouvez utiliser notre plateforme de staging. Cette plateforme est disponible ici :
https://signup-staging.api.gouv.fr/ (lien direct vers une demande API Particulier :
https://signup-staging.api.gouv.fr/api-particulier).

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

- signup.api.gouv.fr
- auth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

En outre, il vous permet d'instancier un environnement de développement local pour ces services.
Pour ce faire merci de prendre connaissance de la suite du document (en anglais).

## Install

### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.5.0](https://www.ansible.com/)

### Signup local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.com:etalab/api.gouv.fr/signup.git
cd signup/
git submodule foreach git fetch
git submodule foreach git pull origin master
git submodule foreach git checkout master
```

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 signup-development.particulier-infra.api.gouv.fr
192.168.56.125 signup-development.api.gouv.fr
192.168.56.125 back.signup-development.api.gouv.fr

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

Deploy Signup backend:
```bash
vagrant ssh signup
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

Load fixtures in Signup back:
```bash
vagrant ssh signup
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

Deploy Signup frontend:
```bash
vagrant ssh signup
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

Go to https://signup-development.api.gouv.fr/. Sign in as `user@yopmail.com` with the password `password`. Then, you should see the enrollment list.
Note that other credentials can be found [here](https://github.com/betagouv/api-auth/blob/master/scripts/fixtures.sql).

### Run the apps in interactive mode (optional)

If you want to launch interactively signup-front:
```bash
vagrant ssh signup
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
vagrant ssh signup
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

[![architecture](https://docs.google.com/drawings/d/e/2PACX-1vRQgClO24uIMZMY-7DZCqz2QqaaDUjepysMv2zHEY4hrOkgGTz8FFXBMxNnNR-uD3F-ZknXHeHbksCj/pub?w=960&h=903)](https://docs.google.com/drawings/d/1rJl6g-BFKO--4EWmbSgn3Wq7H8LCxDUvey_xlN-3Sp4/edit?usp=sharing)

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
vagrant ssh signup
cat ~/.ssh/authorized_keys
```

in: `/home/signup/.ssh/authorized_keys`

Then you can use this key to configure ssh connection to: `ssh://signup@192.168.56.125:22/home/signup/.rbenv/versions/2.4.2/bin/ruby`

### React dev tools keep disconnecting

Add the following lines in `/etc/nginx/sites-enabled/signup-front` at the end of the `location /` section :

```
    # the following two timeout rules fix CRA WDS disconnects after 60s
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
```

See this issue on github : https://github.com/facebook/create-react-app/issues/8203#issuecomment-571605090

### Slow hot reloading in signup-front

If you experience slow hot reloading in interactive mode for signup-front, execute this on your host AND on the signup VM:

```shell script
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

More details here: https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers
