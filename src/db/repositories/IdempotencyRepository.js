import { Idempotency } from "../models/idempotencyModel.js";

export const findByKey = async (key) => {
    return await Idempotency.findOne({key});
};

export const createKey = async (data) =>{
    return await Idempotency.create(data);
};

export const deleteKey = async (key) => {
    return await Idempotency.findOneAndDelete({key});
};