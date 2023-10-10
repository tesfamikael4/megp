#!/bin/bash

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/server/iam-be/Dockerfile -t iam-be .

# Tag the Docker image with a custom repository and tag
docker tag iam-fe:latest gitlab.peragosystems.com:5050/megp/megp/iam-be:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/iam-be:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi iam-fe:latest
