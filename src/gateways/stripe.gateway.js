import ApiError from "../utils/apiError.js";

export const processStripePayment = async (payment) => {
    // Simulate network delay: 600ms to 1400ms
    const delay = Math.floor(Math.random() * 800) + 600;
    await new Promise((res) => setTimeout(res, delay));

    // Simulate 18% failure rate
    const isSuccess = Math.random() > 0.18;

    if (!isSuccess) {
        throw new ApiError(400, "Stripe Payment Failed: card declined or network error");
    }

    return { status: "SUCCESS" };
};