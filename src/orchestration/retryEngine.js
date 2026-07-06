import ApiError from "../utils/apiError.js";
import { getGatewayHandler } from "../gateways/gateway.factory.js";
import { logMetric } from "../metrics/metrics.service.js";

const MAX_RETRIES = 2;

export const executeWithRetry = async (payment, gatewayList) => {
  for (let i = 0; i < gatewayList.length; i++) {
    const gateway = gatewayList[i];
    const handler = getGatewayHandler(gateway);

    let attemptCount = 0;

    while (attemptCount < MAX_RETRIES) {
      const startTime = Date.now();
      try {
        attemptCount++;

        const result = await handler(payment);
        const latencyMs = Date.now() - startTime;

        // Log metric database telemetry
        logMetric(gateway, latencyMs, "SUCCESS").catch((err) => {
          console.error("Failed to log telemetry metric:", err);
        });

        // ✅ success
        payment.attempts.push({
          gateway,
          status: "SUCCESS",
        });

        return { result, gateway };

      } catch (error) {
        const latencyMs = Date.now() - startTime;

        // Log metric database telemetry
        logMetric(gateway, latencyMs, "FAILED", error.message).catch((err) => {
          console.error("Failed to log telemetry metric:", err);
        });

        // ❌ failure
        payment.attempts.push({
          gateway,
          status: "FAILED",
          error: error.message,
        });

        if (attemptCount >= MAX_RETRIES) {
          break; // move to next gateway
        }
      }
    }
  }

  // ❌ all gateways failed
  throw new ApiError(500, "All gateways failed");
};