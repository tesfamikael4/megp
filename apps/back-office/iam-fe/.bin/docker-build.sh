#!/bin/sh

# Define variables
DOCKER_IMAGE_PATH="apps/back-office/iam-fe"
IMAGE_NAME="iam-fe"
DOCKER_REGISTRY="gitlab.peragosystems.com:5050/megp/megp"

# Change directory to the root directory of your project
cd ../../../


if [ "$1" ]; then

    # Build the Docker image using the specified Dockerfile
    docker build -f "$DOCKER_IMAGE_PATH/Dockerfile" -t "$IMAGE_NAME:$1" .

    # Push the tagged Docker image to the remote repository
    docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$1"

    # Tag the Docker image with a custom repository and tag
    docker tag "$IMAGE_NAME:$1" "$DOCKER_REGISTRY/$IMAGE_NAME:latest"

    # Push the tagged Docker image to the remote repository
    docker push "$DOCKER_REGISTRY/$IMAGE_NAME:latest"

else
  echo "Image tag argument is missing. Please provide an image tag."
  exit 1
fi
