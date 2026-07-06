import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        response: {
            type: mongoose.Schema.Types.Mixed,
        },
        status: {
            type: String,
            enum: ["PROCESSING", "COMPLETED", "FAILED"],
            default: "PROCESSING",
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 86400, // 24 hours TTL
        },
    },
    { timestamps: true }
);

export const Idempotency = mongoose.model("Idempotency", idempotencySchema);
