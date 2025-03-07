const express = require("express");
const {
  findAll,
  save,
  findbyId,
  deletebyId,
  update,
} = require("../controllers/listing");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure storage with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "product_type_images"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({ storage });

router.get("/getAllProduct", findAll);
router.post("/create", upload.single("file"), save); // Change 'file' to 'image' in Flutter

router.get("/:id", findbyId);
router.delete("/:id", deletebyId);
router.put("/:id", update);

module.exports = router;
