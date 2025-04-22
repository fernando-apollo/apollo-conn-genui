include .production.env

publish:
	./update_tag.sh && \
	gcloud builds submit --tag ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}:${TAG}

deploy:
	gcloud run deploy conn-webui \
		--image ${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}:${TAG} \
		--platform managed \
		--region ${LOCATION} \
		--allow-unauthenticated \
		--max-instances=1

get-url:
	gcloud run services describe ${APP_NAME} --region ${LOCATION} --format 'value(status.url)'