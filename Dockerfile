FROM alpine:3.9 as builder

ARG VERSION

RUN apk add --no-cache git nodejs

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/bisd-device-checkin-client.git /client

WORKDIR /client

RUN npm install

ENV API_BASE="/checkin/api/2.0"
ENV CHARGE_BASE="/charges/edit?type=id&search="

RUN npm run build-prod

FROM alpine:3.9

RUN apk add --no-cache caddy

COPY --from=builder /client/dist /www

WORKDIR /www

RUN echo ":8080" > /Caddyfile && echo "log /dev/stdout" >> /Caddyfile

CMD ["caddy", "-conf", "/Caddyfile"]
