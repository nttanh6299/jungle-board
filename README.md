![Jungle board](https://res.cloudinary.com/dkktseuwb/image/upload/v1675172877/elephant-op.png)

_This image is generated from MidJourney_

# 🐯 Jungle board 🦁

This project has been created with the aim of learning new technologies, best practices, problem solving, and other great stuff which are helpful in the future. Mainly focused on the FE part, the BE one was not put much effort (it needs to be polished someday 🐶).

## Tech stack

#### Client

- Nextjs
- Tailwind/HeadlessUI
- Next-auth
- Socket-io
- Zustand/Immer
- Typescript

#### Server

- Express
- MongoDB
- Socket-io
- Typescript

#### Service lib

- [Jungle board service](https://github.com/nttanh6299/jungle-board-service)

## Deployment

Client: [Vercel](https://vercel.com)
Server: [Render](https://render.com)
Service lib: [Npm](https://www.npmjs.com/package/jungle-board-service)

## Features

- [x] Social login (Google, Facebook, Github)
- [x] Play with another player
- [x] Play in anonymous mode
- [x] Cooldown
- [x] Disconnection
- [x] End game
- [x] Join a specific room or auto join
- [x] Create a room
- [x] Buy a board theme
- [x] Exp and coins
- [x] Chat
- [x] Turn logs
- [x] Responsive design
- [x] Localization
- [x] SEO
- [x] Installable app
- [ ] Player surrender
- [ ] Tournament bracket
- [ ] Animation
- [ ] Sounds
- [ ] AI match

## Running app locally

First thing to run is to download the code by cloning the repository:

```cli
git clone git@github.com:nttanh6299/jungle-board.git
```

If you get `Permission denied` error using `ssh`, use `https` link as a fallback:

```cli
git clone https://github.com/nttanh6299/jungle-board.git
```

##### The project has three installation steps:

##### Root

Root directory contains editor configuration, and both the server and client folder:

```cli
yarn install
```

##### Server

The api server, I use `Nodejs` to power my server:

```cli
cd packages/server
yarn install
```

##### Client

Frontend SPA folder using `Nextjs`:

```cli
cd packages/client
yarn install
```

If you standing in the server folder, try to use `cd ../server`

##### Don't forget to add your .env file, it contains all of things that are considered secret there.
