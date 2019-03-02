#!/bin/bash

if [ -z "$DEPLOY_ENV" ]; then
    ./envs/development.sh
else
    ./envs/${DEPLOY_ENV}.sh
    
yarn && yarn build
yarn start

