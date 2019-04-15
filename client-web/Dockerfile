# FOR BUILDER
FROM mhart/alpine-node:11 as builder

RUN mkdir -p /root/src/app
WORKDIR /root/src/app
ENV PATH /root/src/app/node_modules/.bin:$PATH

# Add package file
COPY package.json package.json

# Install package
RUN yarn install

# Add source code
COPY src src
COPY config config
COPY utils utils
COPY webpack.config.js webpack.config.js
COPY babel.config.js babel.config.js

# Run build prod command
RUN yarn build:prod

# FOR RUNNER
FROM nginx:1.15.10-alpine

# Make dir for web client
RUN mkdir -p /home/capstone/web
WORKDIR /home/capstone/web

COPY --from=builder /root/src/app/dist /home/capstone/web
COPY default.nginx.conf /etc/nginx/conf.d/default.conf

VOLUME /home/capstone/web/public
