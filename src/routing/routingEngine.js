export const selectGateways = (context) => {
  const { paymentMethod, amount } = context;

  if (paymentMethod === "UPI") {
    return ["UPI_MOCK", "RAZORPAY"];
  }

  if (amount > 5000) {
    return ["STRIPE", "RAZORPAY"];
  }

  return ["RAZORPAY", "STRIPE"];
};