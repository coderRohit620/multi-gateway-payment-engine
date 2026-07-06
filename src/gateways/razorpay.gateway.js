import ApiError from "../utils/apiError.js";

export const processRazorpayPayment = async (payment) => {
    // Simulate network delay: 400ms to 900ms
    const delay = Math.floor(Math.random() * 500) + 400;
    await new Promise((res) => setTimeout(res, delay));

    // Simulate 12% failure rate
    const isSuccess = Math.random() > 0.12;

    if (!isSuccess) {
        throw new ApiError(400, "Razorpay Payment Failed: bank gateway timeout");
    }

    return { status: "SUCCESS" };
};