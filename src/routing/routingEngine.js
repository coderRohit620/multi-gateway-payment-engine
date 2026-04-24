

export const selectGateway = (context) => {
    const { amount, paymentMethod } = context;

    if (paymentMethod === "UPI") return "UPI_MOCK";
    if (amount > 5000) return "STRIPE";

    return "RAZORPAY";
};