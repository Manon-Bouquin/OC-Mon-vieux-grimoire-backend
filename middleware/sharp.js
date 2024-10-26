//npm install multer sharp
const sharp = require("sharp");
const path = require("path");

const compressImage = async (req, res, next) => {
    if (!req.file){
        return next();
    }
    const name = req.file.originalname.split(" ").join("_").split(".")[0];
    const filename = `${name}_${Date.now()}.webp`;
    const outPath = path.join(__dirname, "../images", filename);
    try {
        await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outPath);
        req.file.filename = filename; //MAJ du nom du fichier
        next();
    } catch (error) {
        res.status(500).json({ error: "Erreur lors du traitement de l'image" });
    }
};

module.exports = compressImage;
