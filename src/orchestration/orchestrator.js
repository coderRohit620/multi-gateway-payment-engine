import ApiError from "../utils/apiError.js";
import { selectGateway } from "../routing/routingEngine.js";
import { getGatewayHandler } from "../gateways/gatewayFactory.js";
import { updateState } from "./stateMachine.js";

export const processPayment = async (payment) => {
    try {
        //Move to PROCESSING
        updateState(payment, "PROCESSING");
        await payment.save();

        // Select gateway
        const gateway = selectGateway(payment);

        // ⚡ Get handler
        const handler = getGatewayHandler(gateway);

        // 💳 Execute payment
        const result = await handler(payment);

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

        throw new ApiError(500, "Payment processing failed");
    }
};