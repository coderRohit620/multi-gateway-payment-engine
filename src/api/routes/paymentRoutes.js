import express from "express";
import { createPaymentController } from "../controllers/paymentController.js";

const router = express.Router();

// router.route("/").post(createPaymentController);

router.post("/",createPaymentController )

router.route("/health").get((req,res) =>{
    res.json({Message : "payment API working"});
});

export default router;