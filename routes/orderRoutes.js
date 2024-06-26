import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddlewares.js";
import {
  createOrderController,
  getMyOrdersCotroller,
  singleOrderDetrailsController,
  getAllOrdersController,
  changeOrderStatusController

} from "../controllers/orderController.js";

const router = express.Router();


//rroutes
// ============== ORDERS ROUTES ==================


// CREATE 
router.post('/create', isAuth, createOrderController);



//  GET ALL ORDERS
router.get("/my-orders", isAuth, getMyOrdersCotroller);



//  GET SINGLE ORDER DETAILS
router.get("/my-orders/:id", isAuth, singleOrderDetrailsController);

// ====================================================================


/// ======== ADMIN PART ============
// get all order
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);


// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

// ====================================================================

export default router;

