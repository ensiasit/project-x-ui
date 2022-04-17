FROM node:lts-alpine as BUILD_STAGE

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
RUN npm install react-scripts@5.0.0 -g --silent

COPY . ./

ENV REACT_APP_API_BASE_URL=http://www.ensiasit.club:8081/api/v1

RUN npm run build

###

FROM node:lts-alpine

RUN npm install -g serve

COPY --from=BUILD_STAGE /app/build /build

EXPOSE 80

CMD ["serve", "-s", "-p", "80", "/build"]
