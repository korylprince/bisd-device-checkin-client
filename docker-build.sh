#!/bin/bash

version=$1

docker build --no-cache --build-arg "VERSION=$version" --tag "korylprince/bisd-device-checkin-client:$version" .

docker push "korylprince/bisd-device-checkin-client:$version"
