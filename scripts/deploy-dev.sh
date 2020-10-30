#!/bin/sh

set -e
set -x


logPrefix(){
  echo "$(date --iso-8601=seconds) - $APP_NAME -"
}

if [ -z $1 ]; then
    echo "$(logPrefix) Error: You must provide the application name as an argument. Ex: ./scripts/deploy.sh signup-front"
    exit 1
fi

APP_NAME=$1
APP_VERSION=master
echo "$(logPrefix) Deploying $APP_NAME..."

echo "$(logPrefix) Preparing installation..."
ROOT_PATH=/opt/apps
APP_PATH=${ROOT_PATH}/${APP_NAME}
TIMESTAMP=$(date +'%Y%m%d%H%M%S')
RELEASES_PATH=${APP_PATH}/current


echo "$(logPrefix) Fetching archive..."



echo "$(logPrefix) Unpacking..."




echo "$(logPrefix) Installing..."
cd ${RELEASES_PATH}
export $(cat /etc/${APP_NAME}.conf | xargs)

if [ -e Gemfile ]; then
    export PATH=$HOME/.rbenv/bin:$PATH # executing /etc/profile.d/rbenv.sh
    export RBENV_ROOT=$HOME/.rbenv
    eval "$(rbenv init -)"
    bundler install
    eval "$(rbenv init -)" # needed at first install to put rails binary in ~/.rbenv/shims
    rails db:migrate
    rails db:seed
fi

if [ -e package.json ]; then





    NODE_ENV=development npm i
    npm run build
fi

if [ -d test/fixtures ]; then
  echo "$(logPrefix) Loading fixtures..."
  rails db:fixtures:load FIXTURES=users,enrollments,events
fi

if [ -e scripts/fixtures.sql ]; then
  echo "$(logPrefix) Loading fixtures..."
  npm run load-fixtures
fi

echo "$(logPrefix) Linking new deployment..."





echo "$(logPrefix) Restarting service..."
sudo /bin/systemctl restart ${APP_NAME}

echo "$(logPrefix) Removing old releases..."



echo "$(logPrefix) Deployment of $APP_NAME successfully completed!"

exit 0
