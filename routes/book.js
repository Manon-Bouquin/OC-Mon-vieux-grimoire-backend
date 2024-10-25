const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");
const compressImage = require("../middleware/sharp");

router.get("/bestrating", bookCtrl.bestRating); //Route spécifique d'abord
router.get("/", bookCtrl.getAllBooks); 
router.get("/:id", bookCtrl.getOneBook); //Route dynamique ensuite
router.post("/", auth, multer, compressImage, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.ratingBook);
router.put("/:id", auth, multer, compressImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook)

module.exports = router;