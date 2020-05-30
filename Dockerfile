FROM      node:lts-buster-slim
LABEL     maintainer="sigfried <@sigfriedcub1990>"

WORKDIR   /usr/src/app
COPY      package.json yarn.lock ./
RUN       yarn

COPY      . .

EXPOSE    3000

CMD       ["yarn", "start:dev"]
