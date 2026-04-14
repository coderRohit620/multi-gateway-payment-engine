import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { createPayment } from "../../db/repositories/paymentRepository";

const createPaymentController = asyncHandler(async(req,res) =>{
    const { amount, currency , userId, paymentMethod } = req.body;

    if(!amount || !userId || !paymentMethod ){
        throw new ApiError(400," Missing Required Fields");
    }

    const payment = await createPayment({
        amount,
        currency,
        userId,
        paymentMethod,
        status:"CREATED",
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, payment, "Payment Created Successfully")
    );
});

export { createPaymentController }

