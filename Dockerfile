FROM node:16-alpine

ARG DockerDBID

ENV DockerDBID=$DockerDBID

ARG cloudinaryCloudName

ENV cloudinaryCloudName=$cloudinaryCloudName

ARG cloudinaryApiKey

ENV cloudinaryApiKey=$cloudinaryApiKey

ARG cloudinaryApiSecret

ENV cloudinaryApiSecret=$cloudinaryApiSecret

ARG secretKey

ENV secretKey=$secretKey

ARG redisPassword

ENV redisPassword=$redisPassword

# ENV DockerDBID=2

WORKDIR /app

COPY . .   

RUN npm install

EXPOSE 5000

CMD [ "node" ,"server.js" ]

