FROM node:6
MAINTAINER Brian Bartholomew <me@bcbrian.com>

RUN mkdir -p /usr/api
COPY . /usr/api
WORKDIR /usr/api
RUN npm install

ENV PORT 8080
EXPOSE  $PORT

CMD ["npm", "run", "start:prod"]
