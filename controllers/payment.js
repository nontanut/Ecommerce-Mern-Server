const Payments = require("../models/payment");
const Users = require("../models/user");
const Products = require("../models/product");

const sold = async (id, quantity, oldSold) => {
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

exports.getPayment = async (req, res) => {
    try {
        // find all payment
        const payments = await Payments.find();
        res.json(payments);
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

exports.createPayment = async (req, res) => {
    try {
        // find from user.id get only name and email
        const user = await Users.findById(req.user.id).select("name email")
        if (!user) {
            return res.status(400).json({msg: "User does not exist."});

        }

        const {cart, paymentID, address} = req.body;
        const {_id, name, email} = user;

        const newPayment = new Payments({
            user_id: _id, name, email, cart, paymentID, address
        })

        cart.filter(item => {
            return sold(item._id, item.quantity, item.sold)
        })

        await newPayment.save()
        res.json({msg: "Payment Success"});

    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}
