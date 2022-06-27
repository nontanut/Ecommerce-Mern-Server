const Products = require("../models/product");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} // queryString = req.query

        const excludedFields = ["page", "sort", "limit"]
        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj);
        // filter search // regex for text
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match)

        this.query.find(JSON.parse(queryStr))
        return this;
    }

    sorting(){
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ")
            this.query = this.query.sort(sortBy)
        }else{
            // sort gt to lt 
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }

    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10 // 10 product/perpage
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


exports.getAllProducts = async (req, res) => {
    try {
        // 
        const features = new APIfeatures(Products.find(), req.query).filtering().sorting().pagination();
        const products = await features.query

        // const products = await Products.find()
        // res.json(products)

        res.json({
            status: "success",
            result: products.length,
            products: products
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.createProduct = async (req, res) => {
    try {
        const {product_id, title, price, description, content, images, category} = req.body;
        let slug = slugify(title);

        if (!slug) slug = uuidv4();

        // check image
        if (!images) {
            return res.status(400).json({msg: "No image upload"})
        }

        // check data
        const product = await Products.findOne({product_id});
        if (product) {
            return res.status(400).json({msg: "This product already exists."})
        }

        // product format
        const newProduct = new Products({
            product_id, 
            title: title.toLowerCase(), 
            price, 
            description, 
            content, 
            images, 
            category,
            slug
        })

        await newProduct.save();
        res.json("Created");
    
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.json({msg: "The product has been Deleted"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {title, price, description, content, images, category} = req.body;
        let slug = slugify(title);

        // check slug
        if (!slug) slug = uuidv4();

        // check image
        if (!images) {
            return res.status(400).json({msg: "No image upload"})
        }
        
        // update
        await Products.findOneAndUpdate({_id: req.params.id}, {
            title: title.toLowerCase(), price, description, content, images, category, slug
        })

        res.json({msg: "Updated"})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}
