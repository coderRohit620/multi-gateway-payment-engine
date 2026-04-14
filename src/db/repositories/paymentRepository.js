import { Payment } from "../models/paymentModel.js";

export const createPayment = async (data) => {
    return await Payment.create(data);
};