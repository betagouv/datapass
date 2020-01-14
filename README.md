# Signup

Dépôt ansible pour déployer les services [api.gouv.fr](https://api.gouv.fr).

![Signup](screenshot-signup.jpg)

Ces scripts ansible permettent de gérer :

- signup.api.gouv.fr : l'application de contractualisation des APIs de api.gouv.fr
- auth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

## Install

### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.5.0](https://www.ansible.com/) or `brew install ansible` (this may take a while)
- dnspython

For more information, see https://gitlab.com/etalab/api.gouv.fr/api-particulier-ansible#dependencies-setup
(if this goes to a `404`, ask a teammate to allow your profile on the project.)

### Signup local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.com:etalab/api.gouv.fr/signup-ansible.git
cd signup-ansible/
git submodule foreach git fetch
git submodule foreach git pull origin master
git submodule foreach git checkout master
```

Some sensitive information are encrypted in ansible's vault. To read it you will need to set the vault password.

Ask a teammate for the password. Put it in `~/.ssh/signup_ansible_vault`.

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
ansible-galaxy install -r requirements.yml # install `ansible roles`: https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html
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
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts configure.yml # This can take a while, go make a loaf of bread or something
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

Go to https://signup-development.api.gouv.fr/. Sign in as `user@test` with the password `password`. Then, you should see the enrollment list.
Note that other credentials can be found [here](https://github.com/betagouv/api-auth/blob/master/scripts/fixtures.sql).

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

### Production-like deployment

For development purpose you may want to have a local iso-production application running. You can do it by running the deployment script instead of processing to a development deployment:

```bash
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventories/development/hosts deploy.yml
```

## Deploy to staging

### Provisioning

See https://gitlab.com/etalab/api.gouv.fr/api-particulier-ansible#configure-staging-instance

### Deployment

#### Deploy staging instance

Use the following command to deploy signup-front, signup-back & api-auth:
```bash
ansible-playbook -i inventories/staging/hosts deploy.yml
```

Use the following command to deploy <app_name> only (app_name can be one of : front, back, api-auth):
```bash
ansible-playbook -i inventories/staging/hosts deploy.yml -t <app_name>
```

#### Deploy production instance

Use the following command to deploy signup-front, signup-back & api-auth:
```bash
ansible-playbook -i inventories/production/hosts deploy.yml
```

Use the following command to deploy <app_name> only (app_name can be one of : front, back, api-auth):
```bash
ansible-playbook -i inventories/production/hosts deploy.yml -t <app_name>
```

## Create admin user on staging

> NB: the procedure is the same on the production environment

Connect to the staging server:
```bash
ssh ubuntu@auth-staging.particulier-infra.api.gouv.fr
```

Connect to the database:
```bash
sudo su - api-auth
psql -U api-auth -d api-auth -W -h 127.0.0.1
# get the password from ansible vault
```

Then grant the user by modifying the user in the database:
```postgres-sql
update users set roles = array_append(roles, 'api_particulier') where email='raphael.dubigny@beta.gouv.fr';
```

The new role can also be 'franceconnect' or 'api_impot_particulier'. More values are available [here](https://github.com/betagouv/signup-back/tree/master/app/models/enrollment).

## Restore database backup

First, get the backup file from ovh cloud. Mind that as we use OVH cold storage, this could take up to 24h.

Second, get the private key to decrypt the backup file:
```
export HOME="$(mktemp -d)"
gpg2 --import < apigouvfr-<ENV>-gpg.priv.asc # ask the password to Raphaël
```

Third, decrypt the backup file:
```
gpg2 --decrypt --output backup.<sql OU tar.gz> <backup_filename>.pgp # same password as previous command
```

Then push the `backup.sql` file on the server with sftp.

Once it's on the remote server, delete your local copy of the different generated files with:
```
shred -u -z backup.sql *.sql.pgp
```

On the destination server, move the archive:
```
sudo mv backup.sql <BACKUP_USER_HOME>
sudo chown <BACKUP_USER>:<BACKUP_USER> <BACKUP_USER_HOME>/backup.sql
sudo su - <BACKUP_USER>
```

If it is a file backup, do:
```
tar -xf backup.tar.gz --directory=/
```

If it is a postgresql backup, do:
```
pg_restore --clean --schema=public --dbname=<DATABASE_NAME> backup.sql
```

Eventually, erase the archive:
```
shred -u -z backup.<sql OU tar.gz>
```

## Generate new gpg key for database backup

Generate a private key with the following commands, replace ENV and PASSWORD params:
```
export HOME="$(mktemp -d)"
cat >foo <<EOF
%echo Generating a default key
Key-Type: default
Key-Length: 4096
Subkey-Type: default
Subkey-Length: 4096
Name-Real: apigouvfr-<ENV>
Name-Email: apigouvfr-<ENV>@example.com
Expire-Date: 0
Passphrase: <PASSWORD>
%commit
%echo done
EOF
gpg2 --batch --generate-key foo
shred -u -z foo
# from https://lists.gnupg.org/pipermail/gnupg-users/2016-September/056735.html
gpg2 --armor --export apigouvfr-<ENV> > public_keys/<ENV>/backup_gpg_key.pub.asc
gpg2 --armor --export-secret-keys apigouvfr-<ENV> > apigouvfr-<ENV>-gpg.priv.asc
```

Put the `apigouvfr-<ENV>-gpg.priv.asc` file and its password in a safe place.

Vault the `public_keys/<ENV>/backup_gpg_key.pub.asc` with:
```
ansible-vault encrypt public_keys/<ENV>/backup_gpg_key.pub.asc
```

Deploy the new key with:
```
ansible-playbook -i inventories/<ENV>/hosts configure.yml -t backup-script
```

## Enable login to new application to login via api-auth on staging

To enable login to a new application via api-auth, you must declare the application as a new oidc client.

> NB: the procedure is the same on the production environment

Connect to the staging server:
```bash
ssh ubuntu@signup-staging.particulier-infra.api.gouv.fr
```

Connect to the database:
```bash
sudo su - api-auth
psql -U api-auth -d api-auth -W -h 127.0.0.1
# get the password from ansible vault
```

Then grant the user by modifying the user in the database:
```postgres-sql
INSERT INTO oidc_clients (name, client_id, client_secret, redirect_uris)
VALUES ('application_name', 'client_id', 'client_secret', '{"https://redirect.uri/callback"}');
```

Here is a suggestion on how to generate client_id and client_secret: https://stackoverflow.com/a/34350507/2590861 .

Oidc clients are loaded at api-auth service startup. Restart the api-auth service to enable your new client:

```bash
sudo systemctl restart api-auth
```

## Configue Matomo (ex Piwik)

To follow the usage of the project, we use a Matomo instances hosted [here](http://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=53&period=range&date=previous30#?module=Dashboard&action=embeddedIndex&idSite=53&period=range&date=previous30&idDashboard=1)
The production configuration can be found in `./inventories/production/group_vars/front.yml`

## Troubleshooting

### Certificates needs renewal

The ssl certificates are configured by ansible.
The certificates are managed letsencrypt's certbot service (except for the development environement).
If the certificate appears out of date, the issue might be that the services that use the certificates
have not been properly restarted. To restart them can run the 'configuration' playbook like so:

```bash
ansible-playbook -i inventories/staging/hosts configure.yml -t ssl --limit <app_name>
```

`app_name` can be one of: 'api-auth', 'signup-back' or 'signup-front'.

If this does not work you can start restarting the nginx service on the server with `sudo systemctl restart nginx`.

## SSH configuration shortcut

To avoid hitting `ssh ubuntu@signup-staging.particulier-infra.api.gouv.fr` but `ssh signup-staging` instead,
add the following lines to your `~/.ssh/config` file:

```
Host *-production *-staging *-development *-test
    Hostname %h.particulier-infra.api.gouv.fr
    User ubuntu
```
