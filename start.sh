#!/bin/bash


# Parse arguments
WEBSOCKET_IP=$1
WEBSOCKET_PORT=$2
HTTP_PORT=$3
RUN_BUILD=$4

# Load existing environment variables from .env file 
if [ -f .env ]; then 
    export $(grep -v '^#' .env | xargs) 
else 
    echo ".env file not found. Please run make-env.sh to create it." 
    exit 1 
fi

if [ -z WEBSOCKET_IP ]; then
    IP="127.0.0.1"
fi

if [ -z WEBSOCKET_PORT ]; then
    WEBSOCKET_PORT=8080
fi

if [ -z HTTP_PORT ]; then
    HTTP_PORT=8081
fi

export WS_HOST=$WEBSOCKET_IP
export WS_PORT=$WEBSOCKET_PORT

if [[ "$RUN_BUILD" == "y" || "$RUN_BUILD" == "Y" || -z "$RUN_BUILD" ]]; then
    npm run build
fi

# Run the Go server
go run servers/webserver/*.go $HTTP_PORT &

# Run the Websocket handler
node servers/websocket/ws.js &

# Wait for both processes to finish
wait
