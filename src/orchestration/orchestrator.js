import ApiError from "../utils/apiError.js";
import { selectGateways } from "../routing/routingEngine.js";
import { executeWithRetry } from "./retryEngine.js";
import { updateState } from "./stateMachine.js";

export const processPayment = async (payment) => {
    try {
        //Move to PROCESSING
        updateState(payment, "PROCESSING");
        if (!payment.attempts) {
            payment.attempts = [];
        }
        await payment.save();

        // Select gateways in route order
        const gatewayList = selectGateways(payment);

        // 💳 Execute payment with routing and retry engine
        const { result, gateway } = await executeWithRetry(payment, gatewayList);

        // Success
        updateState(payment, result.status);
        payment.gatewayUsed = gateway;

        await payment.save();

        return payment;

    } catch (error) {
        // Failure
        updateState(payment, "FAILED");
        await payment.save();

        // Convert unknown errors → ApiError
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, error.message || "Payment processing failed");
    }
};