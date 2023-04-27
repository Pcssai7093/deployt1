FROM node:16-alpine

ENV DockerDBID=2

WORKDIR /app

COPY . .   

RUN npm install

EXPOSE 5000

CMD [ "node" ,"server.js" ]

