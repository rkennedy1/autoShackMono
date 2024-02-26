# Dockerfile

FROM node:latest as base

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn

COPY . .

FROM base as production

ENV NODE_PATH=./build

EXPOSE 1783

RUN yarn build

COPY . .
