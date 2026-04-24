
export const updateState = (payment, newState) => {
    payment.status = newState;
    return payment;
};