import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";

import { createPayment } from "../../db/repositories/paymentRepository.js";
import { processPayment } from "../../orchestration/orchestrator.js";

export const createPaymentController = asyncHandler(async (req, res) => {
    const { amount, currency, userId, paymentMethod } = req.body;

    // 🔴 Validation
    if (!amount || !userId || !paymentMethod) {
        throw new ApiError(400, "Missing required fields");
    }

    // 🗄️ Create payment
    const payment = await createPayment({
        amount,
        currency,
        userId,
        paymentMethod,
    });

    // 🔥 Process payment
    const processedPayment = await processPayment(payment);

    // ✅ Standard response
    return res.status(200).json(
        new ApiResponse(200, processedPayment, "Payment processed successfully")
    );
});