PORT=8080
PROJECT_ID=fernando-generic-poc
APP_NAME=conn-webui
REPO_NAME=conn-webui-repository
TAG=latest
LOCATION=us-central1

publish:
	echo gcloud builds submit --tag ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}:${TAG}

my-echo: \
    echo ${PROJECT_ID} \
    echo ${APP_NAME} \
    echo ${REPO_NAME} \
    echo ${TAG} \
    echo ${LOCATION}

build-docker:
    echo gcloud builds submit --tag ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}:${TAG}
    gcloud builds submit --tag ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}:${TAG}
    # docker build -t ${APP_NAME}:us-central1-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/hellodrayne .
