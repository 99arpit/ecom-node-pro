import express from "express"
import {isAdmin, isAuth } from '../middlewares/authMiddlewares.js';
import {
    createProductController,
    deleteProductImageController,
    deleteProductController,
    getAllProductsController,
    getSingleProductController,
    updateProductController,
    updateProductImageController,
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js"


const router = express.Router();

//router
//get all products
router.get('/get-all', getAllProductsController)

//get single products
router.get('/:id', getSingleProductController)

//create product
router.post('/create', isAuth, isAdmin, singleUpload, createProductController)

//update product
router.put('/:id', isAuth, isAdmin, updateProductController)


// UPDATE PRODUCT IMAGE
router.put(
    "/image/:id",
    isAuth,
    isAdmin,
    singleUpload,
    updateProductImageController
);

// delete product image
router.delete(
    "/delete-image/:id",
    isAuth,
    isAdmin,
    deleteProductImageController
);

// delete product
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);


export default router;
