import ApiError from "../utils/apiError.js";

export const processUPIPayment = async (payment) => {
    await new Promise((res) => setTimeout(res, 1000));

    const isSuccess = Math.random() > 0.3;

    if (!isSuccess) {
        throw new ApiError(400, "UPI Payment Failed");
    }

    return { status: "SUCCESS" };
};