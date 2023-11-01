#!/bin/sh

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/back-office/vendor-fe/Dockerfile -t vendor-fe .

# Tag the Docker image with a custom repository and tag
docker tag vendor-fe:latest gitlab.peragosystems.com:5050/megp/megp/vendor-fe:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/vendor-fe:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi iam-fe:latest
