#!/bin/sh

# Access the arguments passed to the script
APP_NAME="$1" # egp, iamFe, iamBe, administrationFe
CI_COMMIT_SHORT_SHA="$2"
GITLAB_PASSWORD="$3"

GITLAB_USERNAME="gitops"
# Define the GitLab repository URL
REPO_URL="https://gitlab.peragosystems.com/megp/gitops.git"


git config credential.helper store
echo "$REPO_URL $GITLAB_USERNAME:$GITLAB_PASSWORD" > ~/.git-credentials


git config --global user.name "$GITLAB_USERNAME"
git config --global user.email "gitops"@peragosystems.com

# Clone the Git repository
git clone  --single-branch --branch main https://oauth2:$GITLAB_PASSWORD@gitlab.peragosystems.com/megp/gitops.git .

pwd 

ls

# Change to the chart repository
cd "gitops/applications"

# check https://gitlab.peragosystems.com/megp/gitops/-/blob/main/applications/values-dev.yaml


# Extract the current image tag from values.yaml for the specified application
current_tag_value=$(cat values-dev.yaml | grep "$APP_NAME:" -A 1 | awk '/tag:/ {print $2}')

# Update the image tag in values.yaml with the new CI_COMMIT_SHORT_SHA
sed -i "s/$APP_NAME:\n  tag: $current_tag_value/$APP_NAME:\n  tag: $CI_COMMIT_SHORT_SHA/" values-dev.yaml

# Display the contents of values-dev.yaml
cat values-dev.yaml

# Commit and push the changes
git commit -am "$APP_NAME update image tag" && git push origin main
