include .production.env

define get_tag
	$(eval current_tag := $(shell grep '^TAG=' .production.env | cut -d '=' -f2))
	$(eval major := $(shell echo $(current_tag) | cut -d '.' -f1))
	$(eval minor := $(shell echo $(current_tag) | cut -d '.' -f2))
	$(eval new_minor := $(shell echo $$(($(minor) + 1))))
	$(eval TAG := $(major).$(new_minor))
	$(eval export TAG)
	$(shell sed -i.bak "s/^TAG=.*/TAG=$(TAG)/" .production.env)
endef

publish:
	$(call get_tag)
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