import express from "express";
import { addToCart, fetchMyCart } from "../controllers/Cart.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/add", isAuth, addToCart);
router.post("/all", isAuth, fetchMyCart);

export default router;
