#!/bin/sh

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/back-office/tendering-fe/Dockerfile -t tendering-fe .

# Tag the Docker image with a custom repository and tag
docker tag tendering-fe:latest gitlab.peragosystems.com:5050/megp/megp/tendering-fe:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/tendering-fe:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi tendering-fe:latest
