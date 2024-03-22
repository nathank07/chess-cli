#!/bin/bash

read -p "Set new env var? (y/n) " -n 1 -r continue
if [[ $continue =~ ^[Yy]$ ]]
then
    export JWT_KEY=$(openssl rand -hex 64)
    export SESSION_KEY=$(openssl rand -hex 64)
    if grep -q "JWT_KEY=" .env; then
        sed -i "s/^JWT_KEY=.*/JWT_KEY=$JWT_KEY/" .env
    else
        echo "JWT_KEY=$JWT_KEY" >> .env
    fi

    if grep -q "SESSION_KEY=" .env; then
        sed -i "s/^SESSION_KEY=.*/SESSION_KEY=$SESSION_KEY/" .env
    else
        echo "SESSION_KEY=$SESSION_KEY" >> .env
    fi
    echo -e "\nCreated new keys for JWT_KEY and SESSION_KEY"
else
    echo -e "\nExiting..."
    exit 1
fi
