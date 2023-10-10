# Malawi Electronic Government Procurement [megp]

## Introduction

## How to setup the project

## How to run

## How to deploy

### Docker build and run application

```
docker build -f apps/back-office/iam-fe/Dockerfile -t iam-fe  .

docker run -d -p 5535:5500 --name egp 10a65ba8b27a \
-e ENV_AUTH_API="http://localhost:3569/api" \
-e ENV_API_BASE_PATH="/api/auth" \
-e ENV_WEBSITE_DOMAIN="http://196.189.118.110:5500" \
-e ENV_WEBSITE_BASE_PATH="/auth" \
-e ENV_RECAPTCHA_SITE_KEY=6LcuHWwoAAAAALEeMcX11ZU0aaplu3ywhCf88swr

```

## Structure
