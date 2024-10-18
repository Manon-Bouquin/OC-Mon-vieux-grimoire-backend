//npm install --save multer
const multer = require("multer");

const MIMES_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "jpg",
    "images/webp": "webp"
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        //remplace les espaces des noms des fichiers par un _ 
        const extension = MIMES_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

module.exports = multer({ storage }).single("image");