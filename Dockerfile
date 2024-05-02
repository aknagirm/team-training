FROM node:current-alpine

LABEL org.opencontainers.image.title="First docker app" \
      org.opencontainers.image.description="First docker app on Angular" \
      org.opencontainers.image.authors="aknagirm"

RUN mkdir -p /usr/src/app2

COPY . /usr/src/app2

WORKDIR /usr/src/app2

EXPOSE 4200

RUN npm install

ENTRYPOINT [ "npm", "start" ]
