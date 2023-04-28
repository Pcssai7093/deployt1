FROM node:16-alpine

ARG DockerDBID

ENV DockerDBID=$DockerDBID

ARG cloudinaryCloudName

ENV cloudinaryCloudName=$cloudinaryCloudName

ARG cloudinaryApiKey

ENV cloudinaryApiKey=$cloudinaryApiKey

ARG cloudinaryApiSecret

ENV cloudinaryApiSecret=$cloudinaryApiSecret

# ENV DockerDBID=2

WORKDIR /app

COPY . .   

RUN npm install

EXPOSE 5000

CMD [ "node" ,"server.js" ]

