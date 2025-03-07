const Product = require("../models/listing");
const { param } = require("../routes/listing");

const findAll = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from DB
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const save = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      image: req.file.filename, // Store only the filename
    });

    await product.save();
    res.status(201).json(product);
  } catch (e) {
    console.error("Error saving product:", e);
    res.status(500).json({ error: "Failed to save product" });
  }
};

const findbyId = async (req, res) => {
  try {
    const types = await Product.findById(req.params.id).populate(
      "product_categoryId"
    );
    res.status(200).json(types);
  } catch (e) {
    res.json(e);
  }
};
const deletebyId = async (req, res) => {
  try {
    const types = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted");
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const types = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(types);
  } catch (e) {
    res.json(e);
  }
};

module.exports = {
  findAll,
  save,
  findbyId,
  deletebyId,
  update,
};
