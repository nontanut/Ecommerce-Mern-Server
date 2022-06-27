const Category = require("../models/category");
const Products = require("../models/product");

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories)
    } catch (err) {
        return res.status(500).json({msg: message})
    }
}

// if user role = 1 => admin
// only admin can create
exports.create = async (req, res) => {
    try {
        const {name} = req.body;
        const category = await Category.findOne({name})
        if (category) {
            return res.status(400).json({msg: "This category already exists."});
        }
        // create
        const newCategory = new Category({name})
        await newCategory.save()

        res.json({msg: "Created"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        // if a category has any product that can't delete
        const products = await Products.findOne({category: req.params.id})
        if (products) {
            return res.status(400).json({msg: "Please delete all products with a relationship."})
        }

        await Category.findByIdAndDelete(req.params.id)
        res.json({msg: "Deleted"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.update = async (req, res) => {
    try {
        const {name} = req.body;
        await Category.findOneAndUpdate({_id: req.params.id}, {name})

        res.json({msg: "Updated"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}