// an user id
// 63c16c3ad393089e5d87fea4

const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminConstructor = module.require("./Schemas/admins");
const userConstructor = module.require("./Schemas/users");
const serviceConstructor = module.require("./Schemas/services");
const messageConstructor = module.require("./Schemas/message");
const Contact = module.require("./Schemas/query");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const DatauriParser = require("datauri/parser");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const userRoutes = require("./Routes/user");
const serviceRoutes = require("./Routes/service");
const wishlistRoutes = require("./Routes/wishlist");
const chatRoutes = require("./Routes/chat");

app.use(cookieParser());
app.use(cors({ origin: true }));

app.use(express.json());
app.use("/user", userRoutes);
app.use("/service", serviceRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/chat", chatRoutes);

dotenv.config("./.env");
mongoose.set("strictQuery", false);
let port = process.env.port || 5000;

const server = app.listen(port, () => {
  console.log(`mongoose server running at port ${port} hii :)`);
  mongoose
    .connect(process.env.dbid)
    .then(() => {
      console.log("mongodb connection successful");
    })
    .catch((err) => {
      console.log(err);
      console.log("mongodb connection error");
    });
});

//  socket.io code

// * users variable maintains all the active socket connections with key userId
let users = {};

function addUser(socketId, userId) {
  users[userId] = socketId;
}

const io = socket(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});
io.on("connection", (clientSocket) => {
  // io.to(clientSocket).emit("welcome","Server: :) hello u r connected");

  clientSocket.on("addUser", (userId) => {
    addUser(clientSocket.id, userId);
  });

  clientSocket.on("sendMessage", (fromUserId, toUserId, Message) => {
    let toSocketId = users[toUserId];
    // console.log("send Message request to "+toSocketId);
    if (toSocketId) {
      clientSocket
        .to(toSocketId)
        .emit("receiveMessage", fromUserId, toUserId, Message);

      const messageId = Message._id;
      messageConstructor
        .updateOne({ _id: messageId }, { seen: true })
        .then((result) => {})
        .catch((err) => {
          console.log("err");
        });
    }
  });
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lancer FreeLancing Project",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: [
    "./server.js",
    "./Routes/user.js",
    "./Routes/service.js",
    "./Routes/chat.js",
    "./Routes/wishlist.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *  get:
 *    summary: This api is used to check if the server is connected to the database or not
 *    description: This api is used to check if the server is connected to the database or not
 *    responses:
 *        200:
 *              description: To test get method
 */
app.get("/", (req, res) => {
  res.send(`server running at port ${port}  hii :) after deployment`);
});

app.post("/resetpassword/:id", (req, res) => {
  const id = req.params.id;
  console.log("hello");
  userConstructor
    .findByIdAndUpdate(
      { _id: id },
      {
        password: req.body.password,
      }
    )
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});

app.post("/insert", async (req, res) => {
  // const FirstName = req.body.firstName
  // const CompanyRole = req.body.companyRole
  // console.log(FirstName, CompanyRole)\
  console.log(req.body);
  const formData = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  try {
    await formData.save();
    res.send("inserted data..");
  } catch (err) {
    console.log(err);
  }
});

/**
 * @swagger
 *  components:
 *      schema:
 *          User:
 *            type: object
 *            properties:
 *                fullname:
 *                    type: string
 *                username:
 *                    type: string
 *                email:
 *                    type: string
 *                password:
 *                    type: string
 *                isSeller:
 *                    type: boolean
 *                isBlock:
 *                    type: boolean
 *                skills:
 *                    type: array
 *                services:
 *                    type: array
 *                wishlist:
 *                    type: array
 *                conversations:
 *                    type: array
 *                about:
 *                    type: string
 *
 */

/**
 * @swagger
 *  components:
 *      schema:
 *          Service:
 *            type: object
 *            properties:
 *                title:
 *                    type: string
 *                description:
 *                    type: string
 *                price:
 *                    type: number
 *                category:
 *                    type: string
 *                seller:
 *                    type: array
 *                isBlock:
 *                    type: boolean
 *
 */

/**
 * @swagger
 * /admin/users:
 *  get:
 *      summary: To get all the users present in the database
 *      description: This api is used fetch all the users from mongodb
 *      responses:
 *          200:
 *              description: This api is used fetch all the users from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schema/User'
 */

app.get("/admin/users", (req, res) => {
  userConstructor
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /admin/services:
 *  get:
 *      summary: To get all the services present in the database
 *      description: This api is used fetch all the services from mongodb
 *      responses:
 *          200:
 *              description: This api is used fetch all the services from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Service'
 */

app.get("/admin/services", (req, res) => {
  serviceConstructor
    .find()
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 *  @swagger
 *  /profile/{uid}:
 *   get:
 *        summary: To get the details of a user
 *        description: This API gets the details of a user
 *        parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the details of a user from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

app.get("/profile/:uid", (req, res) => {
  const id = req.params.uid;
  userConstructor
    .find({ _id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 *  @swagger
 *  /profilee/{pid}:
 *   get:
 *        summary: To get the details of a service
 *        description: This API gets the details of a service
 *        parameters:
 *            - in: path
 *              name: pid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        responses:
 *          200:
 *              description: This api is used fetch the details of a service from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

app.get("/profilee/:pid", (req, res) => {
  const id = req.params.pid;
  serviceConstructor
    .find({ _id: id })
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 *  @swagger
 *  /profile/{uid}:
 *   post:
 *        summary: To update the details of a user
 *        description: This API updates the details of a user
 *        parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *        requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullname:
 *                              type: string
 *                          skills:
 *                              type: string
 *                          about:
 *                              type: string
 *                          password:
 *                              type: string
 *        responses:
 *          200:
 *              description: This api is used to update the details of a user from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

app.post("/profile/:uid", (req, res) => {
  const id = req.params.uid;

  userConstructor
    .findByIdAndUpdate(id, {
      fullname: req.body.fullname,
      $push: { skills: req.body.skills },
      about: req.body.about,
      password: req.body.password,
    })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /forgotpass:
 *  post:
 *      summary: To return a particular user based on his email
 *      description: To return a particular user based on his email
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *      responses:
 *          200:
 *              description: To return a particular user based on his email
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

app.post("/forgotpass", (req, res) => {
  userConstructor
    .find({ email: req.body.email })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /admin/signin:
 *  post:
 *      summary: To return a particular user based on his email
 *      description: To return a particular user based on his email
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          usnam:
 *                              type: string
 *                          eml:
 *                              type: string
 *      responses:
 *          200:
 *              description: hello
 */

app.post("/admin/signin", (req, res) => {
  //   let data = req.body;
  //   let signin = false;

  //   adminConstructor
  //     .find({ email: data.email })
  //     .then((result) => {

  //       let hashnew = bcrypt.hashSync(data.password, 2);

  //       if (bcrypt.compareSync(data.password, result[0].password)) {
  //         res.send(result[0].fullname);
  //       } else {
  //         res.send("err");
  //       }
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });

  let data = req.body;
  let signin = false;
  // console.log(data);
  adminConstructor
    .find({ email: data.usnam })
    .then((result) => {
      if (result[0].password === data.eml) {
        res.send(result[0]);
      } else {
        res.send("hello");
      }
    })
    .catch((err) => {
      res.send("hell");
    });
});

function userSortComparator(sort, order) {
  if (sort === "username" && order === "asc") {
    return { username: 1 };
  } else if (sort === "username" && order === "dsc") {
    return { username: -1 };
  } else if (sort === "datejoined" && order === "asc") {
    return { createdAt: 1 };
  } else if (sort === "datejoined" && order === "dsc") {
    return { createdAt: -1 };
  } else {
    return {};
  }
}

app.post("/admin/user/filter", (req, res) => {
  let data = req.body;
  userConstructor
    .find({
      username: {
        $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
        $options: "i",
      },
    })
    .sort(userSortComparator(data.sort, data.order))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

function serviceSortComparator(sort, order) {
  if (sort === "title" && order === "asc") {
    return { title: 1 };
  } else if (sort === "title" && order === "asc") {
    return { title: -1 };
  } else if (sort === "dateposted" && order === "asc") {
    return { createdAt: 1 };
  } else if (sort === "dateposted" && order === "dsc") {
    return { createdAt: -1 };
  } else if (sort === "price" && order === "asc") {
    return { price: 1 };
  } else if (sort === "price" && order === "dsc") {
    return { price: -1 };
  } else {
    return {};
  }
}

app.post("/admin/service/filter", (req, res) => {
  let data = req.body;
  // console.log(data)
  serviceConstructor
    .find({
      title: {
        $regex: data.search.length == 0 ? /[a-zA-z]*/ : data.search,
        $options: "i",
      },
    })
    .populate("seller")
    .sort(serviceSortComparator(data.sort, data.order))
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /test:
 *  get:
 *      summary: To get all the services along with their seller details
 *      description: This api is used fetch all the services along with their seller details
 *      responses:
 *          200:
 *              description: This api is used fetch all the services along with their seller details from mongodb
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Service'
 */

app.get("/test", async (req, res) => {
  let data = await serviceConstructor.find().populate("seller");
  res.send(data);
});
