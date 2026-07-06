import ApiError from "../../utils/apiError.js";
import { checkIdempotency, saveIdempotency, updateIdempotency, removeIdempotency } from "../../idempotency/idempotency.service.js";

export const idempotencyMiddleware = async (req, res, next) => {
    // Only apply idempotency check for POST requests
    if (req.method !== "POST") {
        return next();
    }

    const key = req.headers["x-idempotency-key"];
    if (!key) {
        return next(new ApiError(400, "X-Idempotency-Key header is required"));
    }

    try {
        const record = await checkIdempotency(key);

        if (record) {
            if (record.status === "PROCESSING") {
                return next(new ApiError(409, "A payment request with this key is already being processed."));
            }
            if (record.status === "COMPLETED") {
                return res.status(200).json(record.response);
            }
        }

        // Save initial state as PROCESSING
        await saveIdempotency(key, null, "PROCESSING");

        // Override res.json to capture and save the response on success
        const originalJson = res.json;
        res.json = function (body) {
            res.json = originalJson;

            if (res.statusCode >= 200 && res.statusCode < 300) {
                updateIdempotency(key, body, "COMPLETED").catch((err) => {
                    console.error("Failed to update idempotency to COMPLETED:", err);
                });
            } else {
                // Remove the key on client error / payment failure to allow retries
                removeIdempotency(key).catch((err) => {
                    console.error("Failed to clean up idempotency key on failure:", err);
                });
            }

            return originalJson.call(this, body);
        };

        next();
    } catch (error) {
        next(error);
    }
};
