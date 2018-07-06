#!/bin/sh

set -e

{
if [ -z $1 ]; then
    echo 'Error: You must provide the application name as an argument. Ex: ./scripts/deploy.sh api-particulier'
    exit 1
fi

APP_NAME=$1
APP_VERSION=master

echo 'Deploying '${APP_NAME}'...'

echo 'Fetching archive...'
curl -f -L https://github.com/betagouv/${APP_NAME}/archive/${APP_VERSION}.tar.gz --output ${APP_NAME}-${APP_VERSION}.tar.gz

echo 'Preparing installation...'
ROOT_PATH=/opt/apps
APP_PATH=${ROOT_PATH}/${APP_NAME}
CONFIG_PATH=/etc/${APP_NAME}.conf
TIMESTAMP=$(date +'%Y%m%d%H%M%S')
RELEASES_PATH=${APP_PATH}/releases/${TIMESTAMP}
mkdir -p ${APP_PATH}/releases

echo 'Unpacking...'
tar -xzf ${APP_NAME}-${APP_VERSION}.tar.gz
mv ${APP_NAME}-${APP_VERSION}/ ${RELEASES_PATH}
rm ${APP_NAME}-${APP_VERSION}.tar.gz

echo 'Installing...'
cd ${RELEASES_PATH}

if [ -e Gemfile ]; then
    # TODO remove this block with api-particulier-admin (see https://github.com/betagouv/api-particulier-auth/issues/19)
    bundler install
    export $(cat ${CONFIG_PATH} | xargs) && rails db:migrate
    export $(cat ${CONFIG_PATH} | xargs) && rails db:seed
fi

if [ -e package.json ]; then
    # unsafe-perm: see https://github.com/nodejs/node-gyp/issues/454#issuecomment-58792114
    npm i --unsafe-perm --prod
fi

echo 'Linking new deployment...'
if [ -h ${APP_PATH}/current ]; then
    rm ${APP_PATH}/current
fi
ln -s ${RELEASES_PATH} ${APP_PATH}/current

echo 'Restarting service...'
sudo service ${APP_NAME} restart

echo 'Removing old releases...'
cd ${APP_PATH}/releases
ls -t . | tail -n +6 | xargs rm -rf

echo 'Deployment of '${APP_NAME}' successfully completed!'

exit 0
} > /var/log/apps-deployment.log
