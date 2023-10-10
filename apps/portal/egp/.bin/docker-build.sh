#!/bin/bash

# Change directory to the root directory of your project
cd ../../../

# Build the Docker image using the specified Dockerfile
docker build -f apps/portal/egp/Dockerfile -t egp .

# Tag the Docker image with a custom repository and tag
docker tag egp:latest gitlab.peragosystems.com:5050/megp/megp/egp:latest

# Push the tagged Docker image to the remote repository
docker push gitlab.peragosystems.com:5050/megp/megp/egp:latest

# Optionally, remove the local Docker image if you don't need it anymore
# docker rmi egp:latest
