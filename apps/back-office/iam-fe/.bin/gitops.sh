#!/bin/sh

# Access the arguments passed to the script
APP_NAME="$1"
CI_COMMIT_SHORT_SHA="$2"


# Set Git configuration
git config --global user.name "gitops"
git config --global user.email "gitops"@gitlab.com

# Clone the Git repository
git clone --single-branch --branch main "https://gitlab.peragosystems.com/megp/gitops.git"

# Change to the chart repository
cd "applications"

# Extract the current image tag from values.yaml
current_tag_value=$(cat values-dev.yaml | grep "egp:" -A 1 | awk '/tag:/ {print $2}')

# Update the image tag in values.yaml with the CI_COMMIT_SHORT_SHA
sed -i "s/$APP_NAME:\n  tag: $current_tag_value/egp:\n  tag: $CI_COMMIT_SHORT_SHA/" values-dev.yaml
# Display the contents of $CD_MANIFEST_FILE
cat values-dev.yaml

# Commit and push the changes
git commit -am "$APP_NAME update image tag" && git push origin main
