include .env

MAIN_PACKAGE_PATH := ./cmd/api
BINARY_NAME := api

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]


# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run/api: run cmd/api application
.PHONY: run/api
run/api:
	@go run ${MAIN_PACKAGE_PATH} \
		-db-dsn=${DATABASE_URL} \
		-port=${API_PORT} \
		-storage-account-id=${STORAGE_ACCOUNT_ID} \
		-storage-access-key-id=${STORAGE_ACCESS_KEY_ID} \
		-storage-access-key-secret=${STORAGE_SECRET_ACCESS_KEY} \
		-storage-bucket=${STORAGE_BUCKET_NAME} \
		-storage-public-url=${STORAGE_PUBLIC_ACCESS_URL} \
		-session-store-dsn=${REDIS_URL} \
		-session-store-secret=${SESSION_SECRET} \
		-cors-trusted-origins=${CORS_ORIGINS} \
		-seed=${SEED_USER}

## build: build the application
.PHONY: build
build:
	@go build -o=/tmp/bin/${BINARY_NAME} ${MAIN_PACKAGE_PATH}

## run/live: run the application with reloading on file changes
.PHONY: run/live
run/live:
	@go run github.com/cosmtrek/air@v1.43.0 \
		--build.cmd "make build" --build.bin "/tmp/bin/${BINARY_NAME}" --build.delay "100" \
		--build.include_dir "internal,cmd" \
		--misc.clean_on_exit "true" \
		-- \
		-db-dsn=${DATABASE_URL} \
		-port=${API_PORT} \
		-storage-account-id=${STORAGE_ACCOUNT_ID} \
		-storage-access-key-id=${STORAGE_ACCESS_KEY_ID} \
		-storage-access-key-secret=${STORAGE_SECRET_ACCESS_KEY} \
		-storage-bucket=${STORAGE_BUCKET_NAME} \
		-storage-public-url=${STORAGE_PUBLIC_ACCESS_URL} \
		-session-store-dsn=${REDIS_URL} \
		-session-store-secret=${SESSION_SECRET} \
		-cors-trusted-origins=${CORS_ORIGINS} \
		-seed=${SEED_USER}


## db/psql: connect to the database using psql
.PHONY: db/psql
db/psql:
	psql ${DATABASE_URL}

## db/migrations/new name=$1: create a new database migration
.PHONY db/migrations/new:
db/migrations/new:
	@echo 'Creating migration files for ${name}'
	migrate create -seq -ext=.sql -dir=./migrations ${name}

## db/migrations/up: apply all up database migrations
.PHONY db/migrations/up: confirm
db/migrations/up:
	@echo 'Running migrations...'
	migrate -path ./migrations -database ${DATABASE_URL} up

# ==================================================================================== #
# PRODUCTION
# ==================================================================================== #

## migrate-up: apply all up database migrations
.PHONY migrate-up: confirm
migrate-up:
	@echo 'Running migrations...'
	docker compose --profile tools run --rm migrate up
