const router = require("express").Router();
const serviceConstructor = module.require("../Schemas/services");
const userConstructor = module.require("../Schemas/users");

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
 * /wishlist/add:
 *  put:
 *      summary: To add a service to the wishlist of a user
 *      description: To add a service to the wishlist of a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          sid:
 *                              type: string
 *                          uid:
 *                              type: string
 *      responses:
 *          200:
 *              description: To add a service to the wishlist of a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              acknowledged:
 *                                  type: boolean
 *                              modifiedCount:
 *                                  type: number
 *                              upsertedId:
 *                                  type: string
 *                              upsertedCount:
 *                                  type: number
 *                              matchedCount:
 *                                  type: number
 *
 */

router.post("/add", (req, res) => {
  // contains data of the service and user

  let data = req.body;
  // * handle if service is not added by parsing ack
  const update = { $addToSet: { wishlist: [data.sid] } };
  userConstructor
    .updateOne({ _id: data.uid }, update)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /wishlist/{uid}:
 *  get:
 *      summary: To get all the services in the wishlist for a particular user
 *      description: This api is used fetch all the services in the wishlist for a particular user
 *      parameters:
 *            - in: path
 *              name: uid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *      responses:
 *          200:
 *              description: This api is used fetch all the services in the wishlist for a particular user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schema/User'
 */

router.get("/:uid", (req, res) => {
  let uid = req.params.uid;
  // * important nested population query
  userConstructor
    .findOne({ _id: uid })
    .populate({
      path: "wishlist",
      populate: {
        path: "seller",
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /wishlist/delete:
 *  delete:
 *      summary: To delete a service to the wishlist of a user
 *      description: To delete a service to the wishlist of a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          sid:
 *                              type: string
 *                          uid:
 *                              type: string
 *      responses:
 *          200:
 *              description: To delete a service to the wishlist of a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              acknowledged:
 *                                  type: boolean
 *                              modifiedCount:
 *                                  type: number
 *                              upsertedId:
 *                                  type: string
 *                              upsertedCount:
 *                                  type: number
 *                              matchedCount:
 *                                  type: number
 *
 */

router.post("/delete", (req, res) => {
  // contains data of the service and user
  let data = req.body;
  const update = { $pull: { wishlist: data.sid } };
  userConstructor
    .updateOne({ _id: data.uid }, update)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// service id
// user id
module.exports = router;
