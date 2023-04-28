// const redis = require('redis')
// const client = redis.createClient(process.env.REDIS_PORT);
// client.connect()
// .then(() => {
//     console.log("Redis connected");
// })
// .catch((err) => {
//     console.log(err);
// })
// module.exports=client

const redis = require("redis");

const client = redis.createClient({
  password: "hZlsDgapujBmfHGX7tAm7gTQrHaDqcOE",
  socket: {
    host: "redis-17382.c281.us-east-1-2.ec2.cloud.redislabs.com",
    port: 17382,
  },
});

client
  .connect()
  .then(() => {
    console.log("Redis connected1");
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = client;
