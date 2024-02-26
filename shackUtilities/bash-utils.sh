#!/usr/bin/env bash

# Color definitions
cyan='\033[0;36m'
green='\033[0;32m'
yellow='\033[0;33m'
red='\033[0;31m'
white='\033[1;37m'
blue='\033[0;34m'
gray='\033[0;90m'
no_color='\033[0m'

# Function to echo a header
echo_header() {
  echo -e "\n${cyan}*** $* ***${no_color}\n"
}

# Function to echo a subheader
echo_subheader() {
  echo -e "${cyan}${*}${no_color}"
}

# Function to echo bright text
echo_bright() {
  echo -e "${white}${*}${no_color}"
}

# Function to echo dim text
echo_dim() {
  echo -e "${gray}${*}${no_color}"
}

# Function to echo warning text
echo_warning() {
  echo -e "${yellow}${*}${no_color}"
}

# Function to echo error text
echo_error() {
  echo -e "${red}${*}${no_color}"
}

# Function to echo informational text
echo_info() {
  echo -e "${green}${*}${no_color}"
}
