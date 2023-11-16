#!/bin/sh

# Define variables
DOCKER_IMAGE_PATH="$1"
IMAGE_NAME="$2"
APP_NAME="$3"
BUILD_NUMBER="$4"
GITLAB_PASSWORD="$5"

VERSION="v.$(date +'%Y%m%d').$BUILD_NUMBER"

DOCKER_REGISTRY="gitlab.peragosystems.com:5050/megp/megp"
GITLAB_USERNAME="gitops"
REPO_URL="https://gitlab.peragosystems.com/megp/gitops.git"

# Change directory to the root directory of your project
cd ../../../

if [ "$BUILD_NUMBER" ]; then
    # Build the Docker image using the specified Dockerfile
    docker build --build-arg VERSION_ARG="$VERSION" -f "$DOCKER_IMAGE_PATH/Dockerfile" -t "$IMAGE_NAME:$BUILD_NUMBER" .

    # Check the exit status of the docker build command
    if [ $? -eq 0 ]; then

        # Tag the Docker image with a custom repository and tag
        docker tag "$IMAGE_NAME:$BUILD_NUMBER" "$DOCKER_REGISTRY/$IMAGE_NAME:$BUILD_NUMBER"
        docker tag "$IMAGE_NAME:$BUILD_NUMBER" "$DOCKER_REGISTRY/$IMAGE_NAME:latest"

        # Push the tagged Docker image to the remote repository
        docker push "$DOCKER_REGISTRY/$IMAGE_NAME:$BUILD_NUMBER"

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

echo "-------------- $IMAGE_NAME gitops --------------"

git config credential.helper store
echo "$REPO_URL $GITLAB_USERNAME:$GITLAB_PASSWORD" > ~/.git-credentials


git config --global user.name "$GITLAB_USERNAME"
git config --global user.email "gitops"@peragosystems.com

cd ~

# Clone the Git repository
git clone  --single-branch --branch main https://oauth2:$GITLAB_PASSWORD@gitlab.peragosystems.com/megp/gitops.git 


# Change to the chart repository
cd "gitops/applications"

# https://mikefarah.gitbook.io/yq/v/v3.x/

sed -i "/$APP_NAME:/ { N; s/\(tag:\s*\).*/\1$BUILD_NUMBER/ }" values-dev.yaml


git add .
# Commit and push the changes
git commit -am "$APP_NAME:$BUILD_NUMBER" && git push origin main
