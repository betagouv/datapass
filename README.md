# Signup

Dépôt ansible pour déployer SignUp, l'application d'enrollement à API Particulier

## Development dependencies

- VirtualBox ^5.2.10
- Vagrant ^2.1.1
- NFS
- Ansible 2.5.0
- dnspython

## Install

### Dependencies setup

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#dependencies-setup

### Signup local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.incubateur.net:beta.gouv.fr/signup-ansible.git
```

Some sensitive information are encrypted in ansible's vault. To read it you will need to set the vault password.

Ask a team mate for the password. Put it in `~/.ssh/ansible_vault`.

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 signup-development.particulier-infra.api.gouv.fr
192.168.56.125 signup-development.api.gouv.fr
192.168.56.125 back.signup-development.api.gouv.fr
192.168.56.125 oauth.signup-development.api.gouv.fr
```

Then run:

```bash
ansible-galaxy install -r requirements.yml
vagrant up
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts configure.yml
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts deploy.yml
```

You can now add fixtures data in your apps:

```bash
vagrant ssh
sudo su - signup
export $(cat /etc/signup-oauth.conf | xargs)
cd /opt/apps/signup-oauth/current
rails db:fixtures:load
export $(cat /etc/signup-back.conf | xargs)
cd /opt/apps/signup-back/current
rails db:fixtures:load
```

For development environement, you will have to sync your project folder with the vagrant and deploy the application manually (coming soon).

### Test your installation

In your browser, go to https://oauth.signup-development.api.gouv.fr/oauth/applications , enter the credentials (admin:admin).
You should see the oauth2 dashboard with the registered *back-development* application.

Go to https://back.signup-development.api.gouv.fr/api/enrollments . You should see a error message: "Vous n'êtes pas autorisé à accéder à cette API".

Go to https://signup-development.api.gouv.fr/ . Sign in as particulier@domain.user:password . You should see the enrollment list.

## Deploy to staging

### Provisioning

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#configure-staging-instance

### Deployment

See https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible#deploy-staging-instance

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/staging/hosts configure.yml
```

## Deployment

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/staging/hosts deploy.yml
```

## Generate Secret Key Base

See https://stackoverflow.com/a/34350507/2590861 .
