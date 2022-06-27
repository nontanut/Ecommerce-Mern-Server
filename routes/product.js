const router = require("express").Router();
const {getAllProducts, createProduct, deleteProduct, updateProduct, byCate} = require("../controllers/product");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.post("/create", auth, authAdmin, createProduct);
router.get("/getallproducts", getAllProducts);
router.delete("/product/delete/:id", deleteProduct);
router.put("/product/update/:id", updateProduct);

module.exports = router;