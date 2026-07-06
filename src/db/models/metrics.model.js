import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
    {
        gateway: {
            type: String,
            required: true,
        },
        latencyMs: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            required: true,
        },
        errorMessage: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const Metrics = mongoose.model("Metrics", metricsSchema);
