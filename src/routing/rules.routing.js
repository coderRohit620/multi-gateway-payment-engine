// Standard fallback and threshold rules for gateways
export const routingRules = {
    highAmountThreshold: 5000,
    upiGateways: ["UPI_MOCK", "RAZORPAY"],
    highAmountGateways: ["STRIPE", "RAZORPAY"],
    defaultGateways: ["RAZORPAY", "STRIPE"],
};
