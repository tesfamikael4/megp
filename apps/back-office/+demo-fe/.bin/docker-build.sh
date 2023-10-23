#!/bin/sh

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/back-office/+demo-fe/Dockerfile -t +demo-fe .

# Tag the Docker image with a custom repository and tag
docker tag +demo-fe:latest gitlab.peragosystems.com:5050/megp/megp/+demo-fe:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/+demo-fe:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi +demo-fe:latest
