const Users = require("../models/user");
const Payments = require("../models/payment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: "1d"})
}

exports.register = async(req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;

        if (email === "" || email.trim() === "") {
            return res.status(400).json({msg: "Email is require"});
        }
        const isEmail = emailFormat.test(email);
        if (isEmail) {
            const emailAlready = await Users.findOne({email})
            if (emailAlready) {
                return res.status(400).json({msg: "This email already exists."})
            }
        }
        
        if (password.length < 6) {
            return res.status(400).json({msg: "Password is at least 6 characters."})
        } 

        if (password !== confirmPassword) {
            return res.status(400).json({msg: "Password and confirm password did not match"})
        }

        // password encryption
        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = new Users({
            name,
            email,
            password: passwordHash
        });

        // save mongodb
        await newUser.save()

        // authentication
        const accessToken = createAccessToken({id: newUser._id})

        res.json({accessToken});
        // res.json({msg: "Register Success!"});

    } catch (err) {
        return res.status(500).json({msg: err.message}); 
    }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const isEmail = emailFormat.test(email);
        if (email === "" || email.trim() === "") {
            return res.status(400).json({msg: "E-mail is require."});
        }
        
        let user;
        if (isEmail) {
            user = await Users.findOne({email});
            if (!user) {
                return res.status(400).json({msg: "Email does not exists."})
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({msg: "Incorrect password."})
        }

        const accessToken = createAccessToken({id: user._id})

        res.json({accessToken});
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.getUser = async (req, res) => {
    try {
        // hide password
        const user = await Users.findById(req.user.id).select("-password")
        if (!user) return res.status(400).json({msg: "User does not exists."})

        res.json(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.addCart = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)
        if (!user) {
            return res.status(400).json({msg: "User does not exist."})
        }
        await Users.findOneAndUpdate({_id: req.user.id}, {
            cart: req.body.cart
        })
        return res.json({msg: "Added to cart."})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.history = async (req, res) => {
    try {
        const history = await Payments.find({user_id: req.user.id})

        res.json(history);
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}