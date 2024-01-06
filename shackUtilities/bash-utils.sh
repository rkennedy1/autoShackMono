#!/usr/bin/env bash
# Shamelessly stolen from https://ghe.megaleo.com/pex/pex/blob/6d68b2a2502172a2ddb0026d8b87b129975a9e77/utils/bash-utils.sh
# ^ that does nothing when you source this script, it's just to keep shellcheck editor plugins from being annoying

# Utility code for use in bash scripts.
# To use this file, source it from your script: `source bash-utils.sh`

# Easy unicode emoji access
checkmark="\xe2\x9c\x85"

# Colorful output is nice to have
green="\033[0;32m"
cyan="\033[0;36m"
gray="\033[0;90m"
red="\033[0;31m"
white="\033[1;37m"
yellow="\033[0;33m"
blue=$'\e[0;34m' # Blue output means executing inside SUV
no_color="\033[0m"

function echo_header() {
  echo -e "\n${cyan}*** ${*} ***${no_color}"
}

function echo_subheader() {
  echo -e "${cyan}${*}${no_color}"
}

function echo_bright() {
  echo -e "${white}${*}${no_color}"
}

function echo_dim() {
  echo -e "${gray}${*}${no_color}"
}

function echo_warning() {
  echo -e "${yellow}${*}${no_color}"
}

function echo_error() {
  echo -e "${red}${*}${no_color}"
}

function echo_info() {
  echo -e "${green}${*}${no_color}"
}

function echo_remote() {
  echo -e "${blue}${*}${no_color}"
}

# Validates an "SUV" specifier, which can be an ID (i-000ec246665131ecf), host (i-000ec246665131ecf.workdaysuv.com),
# or any URL on the SUV (https://i-000ec246665131ecf.workdaysuv.com/anything).
#
# Updates the passed variable, so that it contains the SUV's hostname (ID or URL -> host).
# Pass the NAME of the variable you want to validate, without the leading dollar sign,
# so e.g. if $suv contains ID/host/URL: validate_suv_host suv
#
function validate_suv_host() {
  local _varname=$1
  local _suv="$(eval echo \$${_varname})"

  if [[ -z $_suv ]]; then
    return 1
  elif [[ $_suv != *.* ]]; then
    _suv="$_suv.workdaysuv.com"
  elif [[ $_suv == https://* ]]; then
    _suv="$(echo $_suv | grep -Eio "//([^/]+)/" | head -n 1)"
    _suv="${_suv///}"
  fi

  if ! echo "$_suv" | grep -Eq "^i-"; then
    _suv="i-$_suv"
  fi

  if ! echo "$_suv" | grep -Eq "^i-[a-z0-9-]+\.[a-z0-9-]*workday[a-z0-9-]*\.com$"; then
    return 1
  fi

  eval $_varname="'$_suv'"
}