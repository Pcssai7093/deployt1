FROM node:16-alpine

ARG DockerDBID=3

ENV DockerDBID=$DockerDBID

# ENV DockerDBID=2

WORKDIR /app

COPY . .   

RUN npm install

EXPOSE 5000

CMD [ "node" ,"server.js" ]

