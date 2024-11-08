# websocket-chess

## Project Description

websocket-chess is a multiplayer Chess web application created using Webpack, Gin, and Node. A live demo is available at https://nkchess.net.

## Setup

Install npm dependencies with ```npm i```

Before starting servers, set JWT_KEY and SESSION_KEY or simply run
```
./make-env.sh
```
Once you have the keys you should be able to run both servers with the `start.sh` script
```
./start.sh <host_address> <websocket_port> <https_port> <rebundle webpack [YyNn]>
```
or simply
```
./start.sh
```
to run on localhost:8080 (websocket) and localhost:8081 (http) respectively.

If no `start.sh` parameters are defined, access the website at: 
```
http://localhost:8081/
```

**Tip:** Create multiple accounts and use a different browser or incognito mode to play against yourself and test the multiplayer functionality!
