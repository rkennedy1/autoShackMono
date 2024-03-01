# Dockerfile

# Stage 1: Build
FROM node:20 as build

WORKDIR /home/node/app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Production
FROM node:alpine

WORKDIR /home/node/app

COPY --from=build /home/node/app/package*.json ./
COPY --from=build /home/node/app/build ./build

ENV NODE_ENV=production
RUN yarn install --frozen-lockfile && \
    yarn cache clean

EXPOSE 1783

CMD ["node", "./build/index.js"]
