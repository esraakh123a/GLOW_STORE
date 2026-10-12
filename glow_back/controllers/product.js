
const Product = require("../models/product");


// ===============================
// Add New Product
// ===============================

const createProduct = async (req, res) => {

  try {

    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;


    if (!image) {

      return res.status(400).json({
        message: "Product image is required",
      });

    }


    const product = await Product.create({

      name: req.body.name,

      category: req.body.category,

      image: image,

      price: Number(req.body.price),

      discount: Number(req.body.discount || 0),

      description: req.body.description,

      stock: Number(req.body.stock || 0),

      isBestSeller:
        req.body.isBestSeller === "true"

    });


    res.status(201).json({

      message: "Product created successfully",

      product,

    });


  } catch (error) {

    res.status(500).json({

      message: "Error creating product",

      error: error.message,

    });

  }

};


// ===============================
// Get All Products
// ===============================

const getProducts = async (req, res) => {

  try {

    const { category } = req.query;

    let filter = {};


    if (category) {

      filter.category = category;

    }


    const products = await Product.find(filter);


    const productsWithFinalPrice =
      products.map((product) => {

        const finalPrice =
          product.price -
          (product.price * product.discount) / 100;


        return {

          ...product.toObject(),

          finalPrice,

        };

      });


    res.status(200).json({

      products: productsWithFinalPrice,

    });


  } catch (error) {

    res.status(500).json({

      message: "Error getting products",

      error: error.message,

    });

  }

};


// ===============================
// Get Product By ID
// ===============================

const getProductById = async (req, res) => {

  try {

    const product =
      await Product.findById(req.params.id);


    if (!product) {

      return res.status(404).json({

        message: "Product not found",

      });

    }


    res.status(200).json({

      product,

    });


  } catch (error) {

    res.status(500).json({

      message: "Error getting product",

      error: error.message,

    });

  }

};


// ===============================
// Get Best Sellers
// ===============================

const getBestSellers = async (req, res) => {

  try {

    const products = await Product.find({

      isBestSeller: true,

    });


    const productsWithFinalPrice =
      products.map((product) => {

        const finalPrice =
          product.price -
          (product.price * product.discount) / 100;


        return {

          ...product.toObject(),

          finalPrice,

        };

      });


    res.status(200).json({

      products: productsWithFinalPrice,

    });


  } catch (error) {

    res.status(500).json({

      message: "Error getting best seller products",

      error: error.message,

    });

  }

};


// ===============================
// Update Product
// ===============================

const updateProduct = async (req, res) => {

  try {

    const updateData = {

      name: req.body.name,

      category: req.body.category,

      price: Number(req.body.price),

      discount: Number(req.body.discount || 0),

      description: req.body.description,

      stock: Number(req.body.stock || 0),

      isBestSeller:
        req.body.isBestSeller === "true"

    };


    // If a new image was selected
    if (req.file) {

      updateData.image =
        `/uploads/products/${req.file.filename}`;

    }


    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        updateData,

        {

          new: true,

          runValidators: true,

        }

      );


    if (!product) {

      return res.status(404).json({

        message: "Product not found",

      });

    }


    res.status(200).json({

      message: "Product updated successfully",

      product,

    });


  } catch (error) {

    res.status(500).json({

      message: "Error updating product",

      error: error.message,

    });

  }

};


// ===============================
// Delete Product
// ===============================

const deleteProduct = async (req, res) => {

  try {

    const product =
      await Product.findByIdAndDelete(req.params.id);


    if (!product) {

      return res.status(404).json({

        message: "Product not found",

      });

    }


    res.status(200).json({

      message: "Product deleted successfully",

    });


  } catch (error) {

    res.status(500).json({

      message: "Error deleting product",

      error: error.message,

    });

  }

};


module.exports = {

  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,

  getBestSellers,

};

