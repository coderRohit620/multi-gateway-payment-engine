import { Payment } from "../models/payment.model.js";

export const createPayment = async (data) => {
    return await Payment.create(data);
};