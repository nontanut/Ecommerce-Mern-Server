const router = require("express").Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const {uploadFile, deleteImg} = require("../controllers/upload");

// upload image
router.post("/upload",auth, authAdmin, uploadFile);
router.post("/img/delete", auth, authAdmin, deleteImg);

module.exports = router;

