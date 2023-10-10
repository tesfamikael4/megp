#!/bin/bash

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/back-office/planning-fe/Dockerfile -t planning-fe .

# Tag the Docker image with a custom repository and tag
docker tag planning-fe:latest gitlab.peragosystems.com:5050/megp/megp/planning-fe:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/planning-fe:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi planning-fe:latest
