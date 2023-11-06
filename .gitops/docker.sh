#!/bin/sh

# Define variables
DOCKER_IMAGE_PATH="$1"
IMAGE_NAME="$2"
DOCKER_REGISTRY="gitlab.peragosystems.com:5050/megp/megp"

# Change directory to the root directory of your project
cd ../../../

if [ "$3" ]; then
    # Build the Docker image using the specified Dockerfile
    docker build -f "$DOCKER_IMAGE_PATH/Dockerfile" -t "$IMAGE_NAME:$3" .

    # Check the exit status of the docker build command
    if [ $? -eq 0 ]; then

        # Tag the Docker image with a custom repository and tag
        docker tag "$IMAGE_NAME:$3" "$DOCKER_REGISTRY/$IMAGE_NAME:$3"
        docker tag "$IMAGE_NAME:$3" "$DOCKER_REGISTRY/$IMAGE_NAME:latest"

        # Push the tagged Docker image to the remote repository
        docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$3"

        # Push the tagged Docker image to the remote repository
        docker push "$DOCKER_REGISTRY/$IMAGE_NAME:latest"
    else
        # The build failed, so exit with an error message
        echo "Docker build failed. Exiting with an error."
        exit 1
    fi
else
  echo "Image tag argument is missing. Please provide an image tag."
  exit 1
fi
