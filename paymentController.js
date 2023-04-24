const Razorpay = require("razorpay");

const KEY_ID = "rzp_test_BnefbrdGHpkF0K";
const KEY_SECRET = "ziDCT4LbQQqMz19qGx3LfvRf";

module.exports.orders = (req, res) => {
  let instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

  var options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    //   receipt: "order_rcptid_11"
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.send({ code: 500, message: "server error" });
    }
    return res.send({ code: 200, message: "order created ", data: order });
  });
};

module.exports.verify = () => {
  res.send({ verify });
};
