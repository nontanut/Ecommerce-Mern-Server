const router = require("express").Router();
const {getPayment, createPayment} = require("../controllers/payment");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/payment", auth, authAdmin, getPayment);
router.post("/payment/create", auth, createPayment);

module.exports = router;