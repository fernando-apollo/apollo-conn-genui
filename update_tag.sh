#!/bin/bash

# Define the environment file
ENV_FILE=".production.env"

# Read the current TAG value (assumes a line starting with TAG=)
current_tag=$(grep '^TAG=' "$ENV_FILE" | cut -d '=' -f2)

# Extract the major and minor versions (assumes format "v<major>.<minor>")
major=$(echo "$current_tag" | cut -d '.' -f1)
minor=$(echo "$current_tag" | cut -d '.' -f2)

# Increment the minor version
new_minor=$((minor + 1))
new_tag="${major}.${new_minor}"

# Update the file using sed (create a backup with .bak extension)
sed -i.bak "s/^TAG=.*/TAG=${new_tag}/" "$ENV_FILE"

echo "TAG has been updated to ${new_tag}"