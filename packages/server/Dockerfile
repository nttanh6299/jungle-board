FROM node:14.17-alpine

# Root directory
WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
EXPOSE 3001
