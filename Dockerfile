FROM node:lts-alpine as BUILD_STAGE

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
RUN npm install react-scripts@5.0.0 -g --silent

COPY . ./

RUN npm run build

###

FROM nginx:stable-alpine

COPY --from=BUILD_STAGE /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
