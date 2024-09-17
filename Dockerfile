FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

COPY src/ src/

COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .
