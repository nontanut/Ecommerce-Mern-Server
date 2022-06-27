const router = require("express").Router();
const {getCategory, create, deleteCategory, update} = require("../controllers/category");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/category", getCategory);
router.post("/category/create", auth, authAdmin, create);
router.delete("/category/delete/:id", auth, authAdmin, deleteCategory);
router.put("/category/update/:id", auth, authAdmin, update);

module.exports = router;