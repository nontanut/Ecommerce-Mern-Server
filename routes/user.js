const express = require("express");
const router = express.Router();
const {register, login, getUser, addCart, history} = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user/infor",auth, getUser);
router.patch("/addcart", auth, addCart);
router.get("/history", auth, history);

module.exports = router;