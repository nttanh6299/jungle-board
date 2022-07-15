FROM node:14.17-alpine

# Root directory
WORKDIR /usr/src/app

RUN npm install --global lerna

COPY package.json .
COPY lerna.json .

RUN npx lerna clean

RUN yarn install

COPY packages/gameService ./packages/gameService
COPY packages/server ./packages/server
COPY packages/client ./packages/client

RUN npx lerna bootstrap

WORKDIR /usr/src/app/packages/gameService
RUN yarn build

WORKDIR /usr/src/app/packages/server
RUN yarn build

WORKDIR /usr/src/app/packages/client
RUN yarn build

WORKDIR /usr/src/app
CMD ["yarn", "start"]
EXPOSE 3000 3001
