const router = require("express").Router();
const serviceConstructor = module.require("../Schemas/services");
const userConstructor = module.require("../Schemas/users");
const { bufferParser, cloudinary, multerUploads } = require("../cloudinary");
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
 * /service:
 *  get:
 *      summary: To get all the services
 *      description: This api is used fetch all the services
 *      responses:
 *          200:
 *              description: This api is used fetch all the services
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schema/Service'
 */
router.get("/", (req, res) => {
  serviceConstructor
    .find({ isBlock: false })
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /service/{sid}:
 *  get:
 *      summary: To get all the service details along with the seller details
 *      description: This api is used fetch all the service details along with the seller details
 *      parameters:
 *            - in: path
 *              name: sid
 *              required: true
 *              description: string id required
 *              schema:
 *                type: string
 *      responses:
 *          200:
 *              description: This api is used fetch all the service details along with the seller details
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schema/Service'
 */

router.get("/:sid", (req, res) => {
  let serviceId = req.params.sid;
  serviceConstructor
    .findOne({ _id: serviceId })
    .populate("seller")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// router.get("/user/:uid",(req,res)=>{

// });

/**
 *
 * /service/{search}/{sortCategory}/{category}/{price}/{limit}/{skip}
 */
router.get(
  "/:search/:sortCategory/:category/:price/:limit/:skip",
  (req, res) => {
    let searchString = req.params.search;
    let sortCategory = req.params.sortCategory;
    let category = req.params.category;
    let price = req.params.price;
    let limit = req.params.limit;
    let skip = req.params.skip;
    function sortComparater(sortCat) {
      if (sortCat == "priceLTH") return { price: 1 };
      else if ((sortCat = "priceHTL")) return { price: -1 };
      else return {};
    }

    serviceConstructor
      .find({
        title: {
          $regex: searchString == 0 ? /[a-zA-z]*/ : searchString,
          $options: "i",
        },
        category: {
          $regex: category == 0 ? /[a-zA-z]*/ : category,
          $options: "i",
        },
        price: { $lte: price },
        isBlock: false,
      })
      .populate("seller")
      .sort(sortComparater(sortCategory))
      .limit(limit)
      .skip(skip)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

//* route for find total services for a filter
// * returns in the form {count:_COUNT_}
router.get("/count/:search/:sortCategory/:category/:price", (req, res) => {
  let searchString = req.params.search;
  let sortCategory = req.params.sortCategory;
  let category = req.params.category;
  let price = req.params.price;
  // * regex can be used like this
  function sortComparater(sortCat) {
    if (sortCat == "priceLTH") return { price: 1 };
    else if ((sortCat = "priceHTL")) return { price: -1 };
    else return {};
  }

  serviceConstructor
    .find({
      title: {
        $regex: searchString == 0 ? /[a-zA-z]*/ : searchString,
        $options: "i",
      },
      category: {
        $regex: category == 0 ? /[a-zA-z]*/ : category,
        $options: "i",
      },
      price: { $lte: price },
      isBlock: false,
    })
    .sort(sortComparater(sortCategory))
    .then((result) => {
      res.send({ count: result.length });
    })
    .catch((err) => {
      res.send(err);
    });
});

/**
 * @swagger
 * /service/blockHandle:
 *  put:
 *      summary: To block/unblock a service
 *      description: To block/unblock a service
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
 *              description: To block/unblock a service
 *              content:
 *                  application/json:
 *                      BlockStatus:
 *                          type: boolean
 */
router.post("/blockHandle", (req, res) => {
  // const sid=req.params.sid;
  let data = req.body;
  const sid = data.sid;
  const blockVal = data.isBlock;
  serviceConstructor
    .updateOne({ _id: sid }, { isBlock: blockVal })
    .then((result) => {
      res.send(true);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/add", multerUploads, async (req, res) => {
  let data = req.body;
  let imageData = bufferParser(req);
  // console.log(data);
  // console.log(imageData.length);

  // this array has urls of the cloud image
  let productImages = [];
  for (let i = 0; i < 2; i++) {
    await cloudinary.uploader
      .upload(imageData[i])
      .then((response) => {
        // console.log(response.secure_url);
        productImages.push(response.secure_url);
      })
      .catch((err) => {
        res.send(false);
      });
  }
  console.log(productImages);
  // res.send(true);

  let sellerId = req.body.seller;
  console.log(sellerId);
  serviceConstructor({ ...data, productImages })
    .save()
    .then((result) => {
      // * syntax to update
      const update = { $push: { services: [result._id] } };
      userConstructor
        .update({ _id: sellerId }, update)
        .then((result2) => {
          res.send(true);
        })
        .catch((err) => {
          res.send(false);
        });
    })
    .catch((err) => {
      res.send(false);
    });
});

module.exports = router;
