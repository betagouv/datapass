#!/bin/sh

set -e
set -x

{
logPrefix(){
  echo "$(date --iso-8601=seconds) - $APP_NAME -"
}

if [ -z $1 ]; then
    echo "$(logPrefix) Error: You must provide the application name as an argument. Ex: ./scripts/deploy.sh datapass-frontend secret_token staging"
    exit 1
fi

if [ -z $2 ]; then
    echo "$(logPrefix) Error: You must provide the github access token as an argument. Ex: ./scripts/deploy.sh datapass-frontend secret_token staging"
    exit 1
fi

if [ -z $3 ]; then
    echo "$(logPrefix) Error: You must provide the target environment as an argument. Ex: ./scripts/deploy.sh datapass-frontend secret_token staging"
    exit 1
fi

APP_NAME=$1
GITHUB_ACCESS_TOKEN=$2
TARGET_ENV=$3
APP_VERSION=master
echo "$(logPrefix) Deploying $APP_NAME..."

echo "$(logPrefix) Preparing installation..."
ROOT_PATH=/opt/apps
APP_PATH=${ROOT_PATH}/${APP_NAME}
TIMESTAMP=$(date +'%Y%m%d%H%M%S')
RELEASES_PATH=${APP_PATH}/releases/${TIMESTAMP}
mkdir -p ${APP_PATH}/releases

echo "$(logPrefix) Fetching archive..."
cd ${APP_PATH}
LAST_COMMIT=$(curl -s https://api.github.com/repos/betagouv/datapass/commits/$APP_VERSION | jq -r ".sha // empty")

if [ -z $LAST_COMMIT ]; then
    echo "$(logPrefix) Error: $APP_VERSION branch is not present on the repository";
    exit 1
fi

ARTIFACT_NAME=${TARGET_ENV}-${LAST_COMMIT}-build
ARTIFACT_URL=$(curl -s https://api.github.com/repos/betagouv/datapass/actions/artifacts | jq -r --arg ARTIFACT_NAME "$ARTIFACT_NAME" '.artifacts[] | select(.name==$ARTIFACT_NAME).archive_download_url')

if [ -z $ARTIFACT_URL ]; then
    echo "$(logPrefix) Error: Build artifact is not available (yet?) for commit $LAST_COMMIT";
    exit 1
fi

curl -f -L -H "Authorization: token $GITHUB_ACCESS_TOKEN" ${ARTIFACT_URL} --output ${APP_NAME}.zip

echo "$(logPrefix) Unpacking..."
unzip ${APP_NAME}.zip -d ${RELEASES_PATH}
rm ${APP_NAME}.zip

echo "$(logPrefix) Linking new deployment..."
if [ -h ${APP_PATH}/current ]; then
    rm ${APP_PATH}/current
fi
ln -s ${RELEASES_PATH} ${APP_PATH}/current

echo "$(logPrefix) Removing old releases..."
cd ${APP_PATH}/releases
ls . | sort -r | tail -n +6 | xargs rm -rf

echo "$(logPrefix) Deployment of $APP_NAME successfully completed!"

exit 0
} >> /opt/apps/apps-deployment.log
