import * as idempotencyRepository from "../db/repositories/idempotency.repository.js";

export const checkIdempotency = async (key) => {
    return await idempotencyRepository.findByKey(key);
};

export const saveIdempotency = async (key, response, status = "COMPLETED") => {
    return await idempotencyRepository.createKey({
        key,
        response,
        status,
    });
};

export const removeIdempotency = async (key) => {
    return await idempotencyRepository.deleteKey(key);
};

export const updateIdempotency = async (key, response, status = "COMPLETED") => {
    return await idempotencyRepository.updateKey(key, {
        response,
        status
    });
};
