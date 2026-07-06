import express from "express";
import { createPaymentController } from "../controllers/payment.controller.js";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware.js";

const router = express.Router();

router.route("/").post(idempotencyMiddleware, createPaymentController);

// router.post("/",createPaymentController )

router.route("/health").get((req,res) =>{
    res.json({Message : "payment API working"});
});

export default router;