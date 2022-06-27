const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// remove path
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

exports.uploadFile = async (req, res) => {
    try {
        // console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({msg: "No files Upload."})
        }

        const file = req.files.file;
        // size = 1mb
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File too large."})
        }

        // validate file type
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        // cloud folder
        cloudinary.uploader.upload(file.tempFilePath, {folder: "E-commerce-MERN"}, async(err, result) => {
            if (err) throw err;
            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

exports.deleteImg = async (req, res) => {
    try {
        const {public_id} = req.body;
        if (!public_id) {
            res.status(400).json({msg: "No image selected for delete."})
        }
        // delete image by public_id
        cloudinary.uploader.destroy(public_id, async(err, result) => {
            if (err) throw err;

            res.json({msg: "Image Deleted"})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}