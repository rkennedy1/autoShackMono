# Dockerfile

#Stage 1
FROM node:19-alpine as build

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

# Stage 2
FROM nginx:1.25.3 as nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build .
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
