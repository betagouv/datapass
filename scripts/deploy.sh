#!/bin/sh

set -e
set -x

{
if [ -z $1 ]; then
    echo "$(date --iso-8601=seconds) - Error: You must provide the application name as an argument. Ex: ./scripts/deploy.sh api-particulier"
    exit 1
fi

APP_NAME=$1
APP_VERSION=master
# TODO mutualise prefix generation + mutualise deployment script with api-particulier
echo "$(date --iso-8601=seconds) - $APP_NAME - Deploying $APP_NAME..."

echo "$(date --iso-8601=seconds) - $APP_NAME - Preparing installation..."
ROOT_PATH=/opt/apps
APP_PATH=${ROOT_PATH}/${APP_NAME}
TIMESTAMP=$(date +'%Y%m%d%H%M%S')
RELEASES_PATH=${APP_PATH}/releases/${TIMESTAMP}
mkdir -p ${APP_PATH}/releases

echo "$(date --iso-8601=seconds) - $APP_NAME - Fetching archive..."
cd ${APP_PATH}
curl -f -L https://github.com/betagouv/${APP_NAME}/archive/${APP_VERSION}.tar.gz --output ${APP_NAME}-${APP_VERSION}.tar.gz

echo "$(date --iso-8601=seconds) - $APP_NAME - Unpacking..."
tar -xzf ${APP_NAME}-${APP_VERSION}.tar.gz
mv ${APP_NAME}-${APP_VERSION}/ ${RELEASES_PATH}
rm ${APP_NAME}-${APP_VERSION}.tar.gz

echo "$(date --iso-8601=seconds) - $APP_NAME - Installing..."
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

# TODO precompile in production environment (do not config.assets.compile = true in production)
#if [ -d app/assets ]; then
#   echo 'Precompile assets'
#   export $(cat ${CONFIG_PATH} | xargs) && rails assets:precompile
#fi

if [ -e package.json ]; then
    npm i
    npm run build
fi

echo "$(date --iso-8601=seconds) - $APP_NAME - Linking new deployment..."
if [ -h ${APP_PATH}/current ]; then
    rm ${APP_PATH}/current
fi
ln -s ${RELEASES_PATH} ${APP_PATH}/current

echo "$(date --iso-8601=seconds) - $APP_NAME - Restarting service..."
sudo /bin/systemctl restart ${APP_NAME}

echo "$(date --iso-8601=seconds) - $APP_NAME - Removing old releases..."
cd ${APP_PATH}/releases
ls -t . | tail -n +6 | xargs rm -rf

echo "$(date --iso-8601=seconds) - $APP_NAME - Deployment of $APP_NAME successfully completed!"

exit 0
} > /opt/apps/apps-deployment.log
