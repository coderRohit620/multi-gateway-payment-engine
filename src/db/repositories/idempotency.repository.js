import { Idempotency } from "../models/idempotency.model.js";

export const createKey = async (data) =>{
    return await Idempotency.create(data);
}

export const findByKey = async (key) => {
    return await Idempotency.findOne({key});
};

export const deleteKey = async (key) => {
    return await Idempotency.findOneAndDelete({key});
}

export const updateKey = async (key, data) => {
    return await Idempotency.findOneAndUpdate({ key }, data, { new: true });
};