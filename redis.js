const redis = require("redis");
const DEFAULT_EXPIRATION = 20;
// let redisclient;

redisclient = redis.createClient({
  socket: {
    host: "wbdredis.redis.cache.windows.net",
    port: 6380,
    tls: true,
  },
  password: "gXvi9ZLl7qXlf6WmvavocNyVhILSYDnHsAzCaJjDTp0=",
});
redisclient.connect().then((res) => {
  console.log("azure redis connected");
});

module.exports = redisclient;
