ENV_FILE := .production.env
include ${ENV_FILE}

define get_tag
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Error: $(ENV_FILE) does not exist - example: env.sample"; \
		exit 1; \
	fi
	$(eval current_tag := $(shell grep '^TAG=' $(ENV_FILE) | cut -d '=' -f2))
	$(eval major := $(shell echo $(current_tag) | cut -d '.' -f1))
	$(eval minor := $(shell echo $(current_tag) | cut -d '.' -f2))
	$(eval new_minor := $(shell echo $$(($(minor) + 1))))
	$(eval TAG := $(major).$(new_minor))
	# update the TAG in the target file too
	$(shell sed -i.bak "s/^TAG=.*/TAG=$(TAG)/" $(ENV_FILE))
	$(eval export TAG)
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