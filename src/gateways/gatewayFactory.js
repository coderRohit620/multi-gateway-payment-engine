import ApiError from "../utils/apiError.js";
import { processUPIPayment } from "./upiMock.js";
import { processRazorpayPayment } from "./razorpay.js";
import { processStripePayment } from "./stripe.js";

export const getGatewayHandler = (gateway) => {
    switch (gateway) {
        case "UPI_MOCK":
        return processUPIPayment;

        case "RAZORPAY":
        return processRazorpayPayment;

        case "STRIPE":
        return processStripePayment;
        
        default:
        throw new ApiError(400, "Invalid Gateway Selected");
    }
};