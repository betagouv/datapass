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

See https://gitlab.incubateur.net/pkn/api-particulier-ansible#dependencies-setup

### Api Particulier local provisioning

Clone the repo:

```bash
git clone --recursive??? git@gitlab.incubateur.net:pkn/signup-ansible.git
```

Some sensitive information are encrypted in ansible's vault. To read it you will need to set the vault password.

Ask a team mate for the password. Put it in `~/.ssh/ansible_vault`.

Add the following hosts in `/etc/hosts`:

```text
192.168.56.125 oauth.signup.local
192.168.56.125 back.signup.local
```

Then run:

```bash
vagrant up
ansible-galaxy install -r requirements.yml
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts configure.yml
```

Deploy the application manually (an automated script will come soon...):


got to 
https://oauth.signup-development.api.gouv.fr/oauth/applications/new

seed the app

fill in with
signup-back
https://back.signup-development.api.gouv.fr/oauth-callback.html
enrollments user

ID de l'application:
cca0e9ff79a1f0262ebc5f07b98ca0676524de3587c910a5484705d18fddd197

Secret:
bbcd21ec218aa6d44224b23f3ee95cbb37131e79a83f9acfa896c64ce58f9d56

Scopes:
enrollments user

URL du retour d'appel:
https://back.signup-development.api.gouv.fr/oauth-callback.html	




got to https://back.signup-development.api.gouv.fr/api/enrollments
you should see Vous n'êtes pas autorisé à accéder à cette API

## Generate Secret Key Base

See https://stackoverflow.com/a/34350507/2590861 .
