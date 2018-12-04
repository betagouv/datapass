# Signup

Dépôt ansible pour déployer les services [api.gouv.fr](https://api.gouv.fr).

![Signup](screenshot-signup.jpg)

Ces scripts ansible permettent de gérer :

- signup.api.gouv.fr : l'application de contractualisation des APIs de api.gouv.fr
- scopes.api.gouv.fr : le référentiel des périmètres de données autorisés par signup
- oauth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

## Install

### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.5.0](https://www.ansible.com/) or `brew install ansible` (this may take a while)
- dnspython

For more information, see https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#dependencies-setup
(if this goes to a `404`, ask a teammate to allow your profile on the project.)

### Signup local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.incubateur.net:beta.gouv.fr/signup-ansible.git
cd signup-ansible/
git submodule foreach git fetch
git submodule foreach git pull origin master
git submodule foreach git checkout master
```

Some sensitive information are encrypted in ansible's vault. To read it you will need to set the vault password.

Ask a teammate for the password. Put it in `~/.ssh/ansible_vault`.

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 signup-development.particulier-infra.api.gouv.fr
192.168.56.125 signup-development.api.gouv.fr
192.168.56.125 back.signup-development.api.gouv.fr
192.168.56.125 oauth.signup-development.api.gouv.fr

192.168.56.126 scopes-development.particulier-infra.api.gouv.fr
192.168.56.126 scopes-development.api.gouv.fr
```

Then install ansible dependencies: 

```bash
ansible-galaxy install -r requirements.yml # install `ansible roles`: https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html
```

Then configure your virtual machine: 
```bash
vagrant up # This can take a while, go make a loaf of bread or something
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts configure.yml
```

### Development deployment

Deploy the application manually inside the virtual machine:
```bash
vagrant ssh signup
sudo su - signup

# Installs the backend
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
bundler install
eval "$(rbenv init -)"
rails db:migrate
rails db:seed
rails db:fixtures:load
sudo systemctl restart signup-back

# Installs the Oauth server
cd /opt/apps/signup-oauth/current
export $(cat /etc/signup-oauth.conf | xargs)
bundler install
rails db:migrate
rails db:seed
rails db:fixtures:load
sudo systemctl restart signup-oauth

# Installs the frontend
cd /opt/apps/signup-front/current
export $(cat /etc/signup-front.conf | xargs)
npm i
npm run build
sudo systemctl restart signup-front

exit
exit
```

> **If you are using macOS.**
> The host's `/etc/hosts` configuration file may not take effect in the guest machine. You might need to also alter the guest machine's `/etc/hosts`.

Deploy API Scopes:
```bash
vagrant ssh api-scopes
sudo su - api-scopes
cd /opt/apps/api-scopes/current
export $(cat /etc/api-scopes.conf | xargs)
npm i
sudo systemctl restart api-scopes
exit
exit
```


### Test your installation

In your browser, go to https://oauth.signup-development.api.gouv.fr/oauth/applications, enter the credentials (admin:admin).
You should see the oauth2 dashboard with the registered *signup.api.gouv* & *api-particulier-auth* applications.

Go to https://back.signup-development.api.gouv.fr/api/enrollments. You should see a error message: "Vous n'êtes pas autorisé à accéder à cette API".

Go to https://signup-development.api.gouv.fr/. Sign in as service_provider@domain.user:password . You should see the enrollment list. Note that other credentials can be found [here](https://github.com/betagouv/signup-oauth/blob/6b3a8369933b8c9527ca8b4d60b4cc6bcc594fed/test/fixtures/users.yml)

> if you want to install API Particulier, you may now resume on [testing API Particulier installation](https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#test-the-local-installation).

### Run app manually (optional)

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

signup-oauth:
```bash
vagrant ssh signup
sudo systemctl stop signup-oauth
sudo su - signup
cd /opt/apps/signup-oauth/current
export $(cat /etc/signup-oauth.conf | xargs)
RAILS_ENV=development rails s
```

api-scopes:
```bash
vagrant ssh api-scopes
sudo systemctl stop api-scopes
sudo su - api-scopes
cd /opt/apps/api-scopes/current
export $(cat /etc/api-scopes.conf | xargs)
npm start
```

### Production-like deployment

For development purpose you may want to have a local iso-production application running. You can do it by running the deployment script instead of processing to a development deployment:

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts deploy.yml
```

## Deploy to staging

### Provisioning

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#configure-staging-instance

### Deployment

#### Deploy staging instance

Use the following command to deploy front, back & oauth:
```bash
ansible-playbook -i inventories/staging/hosts deploy.yml
```

Use the following command to deploy <app_name> only (app_name can be one of : front, back, oauth):
```bash
ansible-playbook -i inventories/staging/hosts deploy.yml -t <app_name>
```

#### Deploy production instance

Use the following command to deploy front, back &oauth:
```bash
ansible-playbook -i inventories/production/hosts deploy.yml
```

Use the following command to deploy <app_name> only (app_name can be one of : front, back, oauth):
```bash
ansible-playbook -i inventories/production/hosts deploy.yml -t <app_name>
```

## Create admin user

Connect to the staging server:

```bash
ssh ubuntu@signup-staging.particulier-infra.api.gouv.fr
```

Connect to the database:

```bash
sudo su - postgres
psql signup-oauth
```

Then grant the user by modifying the user in the database:

```postgres-sql
select * from account_types;
update users set account_type_id = 4 where email='raphael.dubigny@beta.gouv.fr';
```

Disconnect from this database, then update signup-back:
```postgres-sql
psql signup-back
update users set provider = 'api_particulier' where email='raphael.dubigny@beta.gouv.fr';
```

The user must then logout and login again.

## Generate Secret Key Base or Oauth Client ID & Secret

See https://stackoverflow.com/a/34350507/2590861 .

## Configue Matomo (ex Piwik)

To follow the usage of the project, we use a Matomo instances hosted [here](http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=53&period=range&date=previous30#?module=Dashboard&action=embeddedIndex&idSite=53&period=range&date=previous30&idDashboard=1)
The production configuration can be found in `./inventories/production/group_vars/front.yml`

## Play with API Scopes

As there is no fixtures in API Scopes' database, we detail here the way to add some.

You create an entry with the following commands:
```bash
vagrant ssh api-scopes
mongo scopes-development.api.gouv.fr:27017/scopes -u signup -p signup --eval "db.scopes.insert({client_id: '12',provider:'api-particulier',scopes:['dgfip_avis_imposition', 'dgfip_adresse'],signup_id: '1'})"
```

Then, you can query this entry with `curl -k -H 'x-provider: api-particulier' https://scopes-development.api.gouv.fr/api/scopes/12`.
