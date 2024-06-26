import productModel from "../models/productModel.js";
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary';

//get all product 
export const getAllProductsController = async (req, res) => {

    try {
        const product = await productModel.find({});
        res.status(200).send({
            success: true,
            message: "all product featches successfully",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get all product api",
            error,
        });
    }
};


//get single product
export const getSingleProductController = async (req, res) => {
    try {
        //get product id
        const product = await productModel.findById(req.params.id);
        //valdiation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "product not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "product found successfully",
            product,
        })
    } catch {
        console.log(error);
        //cast error || object id
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "invalid id",
            });
        }
        res.status(500).send({
            success: false,
            message: "error in get single product api",
            error,
        });
    }
};



// // create product
// export const createProductController = async (req, res) => {
//     try {
//         const { name, description, price, category, stock } = req.body;

//         console.log("Request Body: ", req.body);
//         console.log("Request File: ", req.file);

//         //validation
//         // if (!name || !description || !price || !category || !stock) {
//         //     return res.status(400).send({
//         //         success: false,
//         //         message: "Please fill all fields",
//         //     });
//         // }

//         if (!req.file) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Please upload product image",
//             });
//         }

//         const file = getDataUri(req.file);
//         const cdb = await cloudinary.v2.uploader.upload(file.content);
//         const image = {
//             public_id: cdb.public_id,
//             url: cdb.secure_url,
//         };

//         await productModel.create({
//             name,
//             description,
//             price,
//             category,
//             stock,
//             images: [image],
//         });

//         res.status(201).send({
//             success: true,
//             message: "Product created successfully",
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error in creating product",
//             error,
//         });
//     }
// };




// create product
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        console.log("Request Body: ", req.body);
        console.log("Request File: ", req.file);

        // Validation
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please upload product image",
            });
        }

        // Convert category to ObjectId
        const categoryObjectId = mongoose.Types.ObjectId(category);

        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };

        await productModel.create({
            name,
            description,
            price,
            category: categoryObjectId,
            stock,
            images: [image],
        });

        res.status(201).send({
            success: true,
            message: "Product created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error,
        });
    }
};



// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
    try {
        // Find product by ID
        const product = await productModel.findById(req.params.id);

        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        const { name, description, price, stock, category } = req.body;

        // Update product details if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;

        await product.save(); // Save the updated product

        res.status(200).send({
            success: true,
            message: "Product details updated successfully",
            product, // Return the updated product
        });
    } catch (error) {
        console.log(error);

        // CastError || ObjectId error handling
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID",
            });
        }

        res.status(500).send({
            success: false,
            message: "Error updating product",
            error,
        });
    }
};


// UPDATE PRODUCT IMAGE
export const updateProductImageController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // valdiation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }
        // check file
        if (!req.file) {
            return res.status(404).send({
                success: false,
                message: "Product image not found",
            });
        }

        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };
        // save
        product.images.push(image);
        await product.save();
        res.status(200).send({
            success: true,
            message: "product image updated",
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
};


// DELETE PRODUCT IMAGE
export const deleteProductImageController = async (req, res) => {
    try {
        // Find product by ID
        const product = await productModel.findById(req.params.id);

        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        // Find image ID from query parameters
        const imageId = req.query.id;
        if (!imageId) {
            return res.status(400).send({
                success: false,
                message: "Image ID is required",
            });
        }

        // Find the index of the image in the product's images array
        const imageIndex = product.images.findIndex(image => image._id.toString() === imageId);
        if (imageIndex === -1) {
            return res.status(404).send({
                success: false,
                message: "Image not found",
            });
        }

        // Delete the image from Cloudinary
        await cloudinary.v2.uploader.destroy(product.images[imageIndex].public_id);

        // Remove the image from the product's images array
        product.images.splice(imageIndex, 1);
        await product.save();

        return res.status(200).send({
            success: true,
            message: "Product image deleted successfully",
        });
    } catch (error) {
        console.log(error);

        // Handle CastError or ObjectId errors
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID",
            });
        }

        res.status(500).send({
            success: false,
            message: "Error in deleting product image",
            error,
        });
    }
};


// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
    try {
        // Find product by ID
        const product = await productModel.findById(req.params.id);

        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        // Delete images from Cloudinary
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }

        // Delete the product from the database
        await product.deleteOne();

        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);

        // Handle CastError or ObjectId errors
        if (error.name === "CastError") {
            return res.status(400).send({
                success: false,
                message: "Invalid ID",
            });
        }

        res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error,
        });
    }
};
