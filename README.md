# Signup

Dépôt ansible pour déployer les services [api.gouv.fr](https://api.gouv.fr).

![Signup](screenshot-signup.png)

Ces scripts ansible permettent de gérer :

- signup.api.gouv.fr : l'application de contractualisation des APIs de api.gouv.fr
- auth.api.gouv.fr : le SSO des services [api.gouv.fr](https://api.gouv.fr)

## Install

### Dependencies setup

- [VirtualBox \^5.2.10](https://www.virtualbox.org)
- [Vagrant \^2.1.1](https://www.vagrantup.com)
- NFS
- [Ansible 2.5.0](https://www.ansible.com/)

### Signup local provisioning

Clone the repo:

```bash
git clone --recursive git@gitlab.com:etalab/api.gouv.fr/signup-ansible.git
cd signup-ansible/
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
