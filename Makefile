PACKAGE_JSON_FILE_PATH=package.json
DATETIME = $(shell date +"%Y%m%d%H%M%S")
APP_NAME = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.name')
APP_VERSION = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.version')
NODE_ENGINE_VERSION = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.engines.node')
ENVIRONMENTS = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment | keys | join(" ")')

all: help

help:
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "	help			this help"
	@echo "	info			information of the service and some information extracted from package.json file"
	@echo "	dockerfile		build Dockerfile from template.Dockerfile"
	@$(foreach env,$(ENVIRONMENTS),echo "	deploy-"$(env)"	deploy to Kubernetes Engine with environment '"$(env)"'";)
	@echo "	clean			remove Dockerfile"
	@echo ""

info: package.json
	@echo "DATETIME:		" $(DATETIME)
	@echo "APP_NAME:		" $(APP_NAME)
	@echo "APP_VERSION:		" $(APP_VERSION)
	@echo "NODE_ENGINE_VERSION:	" $(NODE_ENGINE_VERSION)
	@echo "ENVIRONMENTS:		" $(ENVIRONMENTS)

define print-env-info
print-env-$1: GC_PROJECT_NAME = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.project')
print-env-$1: CLUSTER_NAME = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.cluster')
print-env-$1: CLUSTER_ZONE = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.zone')
print-env-$1: DOCKER_IMAGE_NAME = gcr.io/$$(GC_PROJECT_NAME)/$(APP_NAME):$(APP_VERSION)-$1
print-env-$1:
	@echo "### $1"
	@echo "DATETIME:		" $(DATETIME)
	@echo "APP_NAME:		" $(APP_NAME)
	@echo "APP_VERSION:		" $(APP_VERSION)
	@echo "NODE_ENGINE_VERSION:	" $(NODE_ENGINE_VERSION)
	@echo "GC_PROJECT_NAME:	" $$(GC_PROJECT_NAME)
	@echo "CLUSTER_NAME:		" $$(CLUSTER_NAME)
	@echo "CLUSTER_ZONE:		" $$(CLUSTER_ZONE)
	@echo "DOCKER_IMAGE_NAME:	" $$(DOCKER_IMAGE_NAME)
	@echo "### end of $1"
endef

# macro to define a deployment target for an environment:
# $1 - environment name
define deployment-target
deploy-$1: project = $(shell cat package.json | jq -r '.deployment.$1.project')
deploy-$1: zone = $(shell cat package.json | jq -r '.deployment.$1.zone')
deploy-$1: cluster = $(shell cat package.json | jq -r '.deployment.$1.cluster')
deploy-$1: cluster_namespace = $(shell cat package.json | jq -r '.deployment.$1.namespace')
deploy-$1: image = gcr.io/$$(project)/$(APP_NAME):$(APP_VERSION)-$1
deploy-$1: ingress = $(shell cat package.json | jq -r '.deployment.$1.ingress')
deploy-$1: print-env-$1
	@echo "Deploying to $1..."
	gcloud container clusters get-credentials $$(cluster) --zone $$(zone) --project $$(project)
	npm run build:$1
	docker build -t $$(image) .
	gcloud docker -- push $$(image)
	APP_NAME=$(APP_NAME) NODE_ENV=$1 IMAGE=$$(image) DATETIME=$(DATETIME) NAMESPACE=$$(cluster_namespace) INGRESS=$$(ingress) envsubst < kubernetes.yaml | kubectl apply -f -
	@echo "DONE"
endef

#define create-configmap
#configmap-$1: GC_PROJECT_NAME = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.project')
#configmap-$1: CLUSTER_NAME = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.cluster')
#configmap-$1: CLUSTER_ZONE = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.zone')
#configmap-$1: CLUSTER_NAMESPACE = $(shell cat $(PACKAGE_JSON_FILE_PATH) | jq -r '.deployment.$1.namespace')
#configmap-$1: configmap.properties
#	@echo "Creating configmap on $1..."
#	@echo "APP_NAME:		" $(APP_NAME)
#	@echo "GC_PROJECT_NAME:	" $$(GC_PROJECT_NAME)
#	@echo "CLUSTER_NAME:		" $$(CLUSTER_NAME)
#	@echo "CLUSTER_ZONE:		" $$(CLUSTER_ZONE)
#	@echo "CLUSTER_NAMESPACE:	" $$(CLUSTER_NAMESPACE)
#	gcloud container clusters get-credentials $$(CLUSTER_NAME) --zone $$(CLUSTER_ZONE) --project $$(GC_PROJECT_NAME)
#	kubectl create configmap $(APP_NAME)-config --from-env-file=configmap.properties --namespace=$$(CLUSTER_NAMESPACE)
#	kubectl get configmap $(APP_NAME)-config -o yaml --namespace=$$(CLUSTER_NAMESPACE)
#	@echo "DONE"
#endef

$(foreach env,$(ENVIRONMENTS),$(eval $(call print-env-info,$(env))))
$(foreach env,$(ENVIRONMENTS),$(eval $(call deployment-target,$(env))))
#$(foreach env,$(ENVIRONMENTS),$(eval $(call create-configmap,$(env))))

.PHONY:
