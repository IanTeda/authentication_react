#!/usr/bin/env bash

## # Environment Variable Replacement Script
##
## This script is used to replace the environment variables in the web-app files
## with the values that are set in the environment. This is done to ensure that
## the web-app is able to connect to the correct backend services.
##
## The script is run as part of the Dockerfile build process and is not intended
## to be run manually.
##
## ## Reference
##
## - https://stackoverflow.com/questions/415677/how-to-replace-placeholders-in-a-text-file
## - https://stackoverflow.com/questions/29613304/how-to-replace-environment-variables-in-a-file-in-docker-container-during-docker
## - [Dynamic Environment Variables for Dockerize React Apps ](https://dev.to/sanjayttg/dynamic-environment-variables-for-dockerized-react-apps-5bc5)
## - [Setting Up Dynamic Environment Variables with Vite and Docker](https://dev.to/dutchskull/setting-up-dynamic-environment-variables-with-vite-and-docker-5cmj)

# if [ -z "$APP_ENV_PREFIX" ]; then
#     echo "APP_ENV_PREFIX is not set. Exiting."
#     exit 1
# fi

# Exit immediately if a command fials or if an unset variable is used
set -o errexit # Exit immediately if a command exits with a non-zero status.
set -o nounset # Treat unset variables as an error.

readonly APP_ENV_PREFIX="${APP_ENV_PREFIX:-AUTHENTICATION_SERVICE}"
readonly TARGET_DIR1="${TARGET_DIR1:-/usr/share/nginx/html/web-app}"
readonly TARGET_DIR2="${TARGET_DIR2:-/tmpl/dist/web-app/}"

# Avoid shell injection with this function to escape special characters for sed
escape_sed() {
  printf '%s\n' "$1" | sed 's/[&/\]/\\&/g'
}

# Check if the script is run with the -n option
# If so, set the dry_run variable to true
# This is used to prevent the script from making any changes to the files
# and only print the commands that would be run
# This is useful for debugging and testing purposes
# If the -n option is not provided, the script will run normally and make changes to the files
# Usage: ./env.sh -n
dry_run=false
while getopts "n" opt; do
  case $opt in
    n)
      dry_run=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done


shift $((OPTIND - 1))

# Check if the APP_ENV_PREFIX variable is set
for i in $(env | grep "^${APP_ENV_PREFIX}"); do
  key=$(echo "$i" | cut -d '=' -f 1)
  value=$(echo "$i" | cut -d '=' -f 2-)

  echo "$key=$value"

  # Escape key and value for use in sed
  escaped_key=$(escape_sed "$key")
  escaped_value=$(escape_sed "$value")

  sed_command="s|\${${escaped_key}}|\${escaped_value}|g"

  if $dry_run; then
    echo "Dry run: find \"${TARGET_DIR1}\" -type f -exec sed -i -e '${sed_command}' {} \\;"
    echo "Dry run: find \"${TARGET_DIR2}\" -type f -exec sed -i -e '${sed_command}' {} \\;"
  else
    find "${TARGET_DIR1}" -type f -exec sed -i -e "${sed_command}" {} \; || echo "Error replacing in ${TARGET_DIR1}"
    find "${TARGET_DIR2}" -type f -exec sed -i -e "${sed_command}" {} \; || echo "Error replacing in ${TARGET_DIR2}"
  fi
done
