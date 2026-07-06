import { Metrics } from "../db/models/metrics.model.js";
import logger from "../utils/logger.js";

export const logMetric = async (gateway, latencyMs, status, errorMessage = "") => {
    try {
        const metric = await Metrics.create({
            gateway,
            latencyMs,
            status,
            errorMessage
        });
        logger.info(`Recorded metric for gateway ${gateway} status ${status} in ${latencyMs}ms`);
        return metric;
    } catch (err) {
        logger.error(`Failed to record metric for gateway ${gateway}`, err);
    }
};
