# Signup

Dépôt ansible pour déployer SignUp, l'application d'enrollement à API Particulier

![Signup](screenshot-signup.jpg)


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
```

Some sensitive information are encrypted in ansible's vault. To read it you will need to set the vault password.

Ask a teammate for the password. Put it in `~/.ssh/ansible_vault`.

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 signup-development.particulier-infra.api.gouv.fr
192.168.56.125 signup-development.api.gouv.fr
192.168.56.125 back.signup-development.api.gouv.fr
192.168.56.125 oauth.signup-development.api.gouv.fr
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
vagrant ssh
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

If you want to enable reload on file change on signup-front:

```bash
vagrant ssh
sudo systemctl stop signup-front
sudo su - signup
cd /opt/apps/signup-front/current
export $(cat /etc/signup-front.conf | xargs)
npm run dev
```

If you want to enable reload on file change on signup-back:

```bash
vagrant ssh
sudo systemctl stop signup-back
sudo su - signup
cd /opt/apps/signup-back/current
export $(cat /etc/signup-back.conf | xargs)
RAILS_ENV=development rails s
```

If you experience trouble reloading, you might want to increase the file watcher limit in both the host and the guest: https://webpack.js.org/configuration/watch/#not-enough-watchers .

Finally, we use the [`prettier`](https://prettier.io) linter. Please configure your IDE accordingly: https://prettier.io/docs/en/editors.html.

#### If you are using macOS, the host's `/etc/hosts` configuration file may not take effect in the guest machine. You might need to also alter the guest machine's `/etc/hosts`.

### Production-like deployment

For development purpose you may want to have a local iso-production application running. You can do it by running the deployment script instead of processing to a development deployment:

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts deploy.yml
```

### Test your installation

In your browser, go to https://oauth.signup-development.api.gouv.fr/oauth/applications, enter the credentials (admin:admin).
You should see the oauth2 dashboard with the registered *signup.api.gouv* application.

Go to https://back.signup-development.api.gouv.fr/api/enrollments. You should see a error message: "Vous n'êtes pas autorisé à accéder à cette API".

Go to https://signup-development.api.gouv.fr/. Sign in as particulier@domain.user:password . You should see the enrollment list. Note that other credentials can be found [here](https://github.com/betagouv/signup-oauth/blob/6b3a8369933b8c9527ca8b4d60b4cc6bcc594fed/test/fixtures/users.yml)

## Deploy to staging

### Provisioning

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#configure-staging-instance

### Deployment

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#deploy-staging-instance

### Create admin user

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

## Generate Secret Key Base

See https://stackoverflow.com/a/34350507/2590861 .

## Configue Matomo (ex Piwik)

To follow the usage of the project, we use a Matomo instances hosted [here](http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=53&period=range&date=previous30#?module=Dashboard&action=embeddedIndex&idSite=53&period=range&date=previous30&idDashboard=1)
The production configuration can be found in `./inventories/production/group_vars/front.yml`
