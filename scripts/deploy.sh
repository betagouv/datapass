#!/bin/sh

set -e
set -x

{
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
RELEASES_PATH=${APP_PATH}/releases/${TIMESTAMP}
mkdir -p ${APP_PATH}/releases

if [ "$APP_NAME" = "api-auth" ]; then
    echo "$(logPrefix) Fetching archive..."
    cd ${APP_PATH}
    curl -f -L https://github.com/betagouv/${APP_NAME}/archive/${APP_VERSION}.tar.gz --output ${APP_NAME}-${APP_VERSION}.tar.gz

    echo "$(logPrefix) Unpacking..."
    tar -xzf ${APP_NAME}-${APP_VERSION}.tar.gz
    mv ${APP_NAME}-${APP_VERSION}/ ${RELEASES_PATH}
    rm ${APP_NAME}-${APP_VERSION}.tar.gz
else
    echo "$(logPrefix) Fetching archive..."
    cd ${APP_PATH}
    curl -f -L https://github.com/betagouv/datapass/archive/${APP_VERSION}.tar.gz --output datapass-${APP_VERSION}.tar.gz

    echo "$(logPrefix) Unpacking..."
    tar -xzf datapass-${APP_VERSION}.tar.gz
    mv datapass-${APP_VERSION}/${APP_NAME}/ ${RELEASES_PATH}
    rm -rf datapass-${APP_VERSION}/
    rm datapass-${APP_VERSION}.tar.gz
fi

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
    PREVIOUS_NODE_MODULE_PATH=$(ls -r -d ${APP_PATH}/releases/* | tail -n +2 | head -n 1)/node_modules
    if [ -d "$PREVIOUS_NODE_MODULE_PATH" ]; then
      echo "$(logPrefix) Copying node modules from previous release..."
      cp -r $PREVIOUS_NODE_MODULE_PATH node_modules
    fi
    npm i
    npm run build
fi

echo "$(logPrefix) Linking new deployment..."
if [ -h ${APP_PATH}/current ]; then
    rm ${APP_PATH}/current
fi
ln -s ${RELEASES_PATH} ${APP_PATH}/current

echo "$(logPrefix) Restarting service..."
sudo /bin/systemctl restart ${APP_NAME}

if [ -e Gemfile ]; then
    echo "$(logPrefix) Restarting sidekiq service..."
    sudo /bin/systemctl restart sidekiq-${APP_NAME}
fi

echo "$(logPrefix) Removing old releases..."
cd ${APP_PATH}/releases
ls . | sort -r | tail -n +6 | xargs rm -rf

echo "$(logPrefix) Deployment of $APP_NAME successfully completed!"

exit 0
} >> /opt/apps/apps-deployment.log
