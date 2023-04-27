const router = require("express").Router();
const bcrypt = require("bcrypt");
const userConstructor = module.require("../Schemas/users");
const jwt = require("jsonwebtoken");
const auth = require("../Middlewares/authorization");

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
 * /user:
 *  get:
 *      summary: To get all the users
 *      description: This api is used fetch all the users
 *      responses:
 *          200:
 *              description: This api is used fetch all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schema/User'
 */
router.get("/", (req, res) => {
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
 * /user/{uid}:
 *  get:
 *      summary: To get all the user details along with the services he posted
 *      description: This api is used fetch all the user details along with the services he posted
 *      parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *      responses:
 *          200:
 *              description: This api is used fetch all the user details along with the services he posted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schema/User'
 */

router.get("/:uid", auth, (req, res) => {
  userConstructor
    .findOne({ _id: req.params.uid })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/update", (req, res) => {
  // * user data update
  const data = req.body;
  const uid = data.uid;

  delete data.uid;

  userConstructor
    .updateOne({ _id: uid }, data)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/temp", auth, (req, res) => {
  res.send(req);
});

/**
 * @swagger
 * /user/forgot:
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

router.post("/forgot", (req, res) => {
  const email = req.body.email;
  userConstructor
    .find({ email: email })
    .then((result) => {
      res.send(result.length == 0);
    })
    .catch((err) => {
      res.send(err);
    });
});

// ------------------------------------------------------
//  chandra's code
/**
 * @swagger
 * /user/chandra/signup:
 *  post:
 *      summary: To add a user to the database
 *      description: To add a user to the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          fullname:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: To add a user to the database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

router.post("/chandra/signup", (req, res) => {
  //   let data = req.body;
  //   userConstructor(data)
  //     .save()
  //     .then((response) => {
  //       res.send(true);
  // //     * redirect to login page
  //     })
  //     .catch((err) => {
  //       res.send(false);
  //     });

  console.log("hello");
  const username = req.body.username;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const obj = {
    fullname: fullname,
    username: username,
    email: email,
    password: password,
  };
  userConstructor(obj)
    .save()
    .then((response) => {
      res.send(response);
      //     * redirect to login page
    })
    .catch((err) => {
      console.log("puk");
      res.send(err);
    });
});

router.get("/profile/:uid", (req, res) => {
  userConstructor
    .findOne({ _id: req.params.uid })
    .populate("services")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/profile/update/:uid", (req, res) => {
  const data = req.body;
  userConstructor
    .updateOne({ _id: req.params.uid }, data)
    .then((result) => {
      res.send(true);
    })
    .catch((err) => {
      res.send(false);
    });
});

function createToken(id) {
  let payload = {
    id: id,
    age: 1 * 24 * 60 * 60 * 2000,
  };
  return jwt.sign(payload, process.env.secretKey);
}

/**
 * @swagger
 * /user/chandra/signin:
 *  post:
 *      summary: To allow a user to access our services in he is in our database
 *      description: To allow a user to access our services in he is in our database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userEmail:
 *                              type: string
 *                          userPassword:
 *                              type: string
 *      responses:
 *          200:
 *              description: To allow a user to access our services in he is in our database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/User'
 */

router.post("/chandra/signin", (req, res) => {
  //   let data = req.body;
  //   let signin = false;
  //   // console.log(data);
  //   userConstructor
  //     .find({ email: data.email })
  //     .then((result) => {

  //       if (bcrypt.compareSync(data.password, result[0].password)) {

  //         let jwtToken=createToken(result[0]._id);
  //         res.send(jwtToken);
  //         // * user need to set this jwttoken in a cookie in format
  //           // {
  //           //   jwt:jwt_Token_Val
  //           // }
  //       } else {
  //         res.send("password not matched");
  //       }
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });

  // response object form
  // {
  //   errors:[],
  //   result:
  //   token:
  // }

  let data = req.body;
  let signin = false;
  let responseObject = {
    errors: [],
  };
  userConstructor
    .find({ email: data.userEmail, isBlock: false })
    .then((result) => {
      if (bcrypt.compareSync(data.userPassword, result[0].password)) {
        let jwtToken = createToken(result[0]._id);

        res.send({ errors: [], result, jwtToken });
        // * user need to set this jwttoken in a cookie in format
        // {
        //   jwt:jwt_Token_Val
        // }
      } else {
        responseObject.errors.push("Password is incorrect");
        res.send(responseObject);
        // return res;
      }
    })
    .catch((err) => {
      responseObject.errors.push("Email is not found");
      res.send(responseObject);
      // return res;
    });
});

/**
 * @swagger
 * /user/blockHandle:
 *  put:
 *      summary: To block/unblock a user
 *      description: To block/unblock a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          sid:
 *                              type: string
 *                          isBlock:
 *                              type: boolean
 *      responses:
 *          200:
 *              description: To block/unblock a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: boolean
 */

router.post("/blockHandle", (req, res) => {
  // const sid=req.params.sid;
  let data = req.body;
  const sid = data.sid;
  const blockVal = data.isBlock;
  userConstructor
    .updateOne({ _id: sid }, { isBlock: blockVal })
    .then((result) => {
      res.send(true);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
