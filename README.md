# websocket-chess

## Bundling and running the front-end
Install dependencies with 
```
npm i
```
Run 
```
npm run build
```
or
```
npm run watch
```
to bundle dist/

## Creating keys and running the back-end

First you need the keys, set JWT_KEY and SESSION_KEY or simply run
```
./make-env.sh
```
Once you have the keys, run the go server with
```
go run servers/webserver/*.go
```
and in another terminal window, run the websocket handler with
```
node servers/websocket/ws.js
```

Once running go and node, access the website at: 
```
http://localhost:8081/
```
**Tip:** Create multiple accounts and use a different browser or incognito mode to play against yourself and test the multiplayer functionality!
