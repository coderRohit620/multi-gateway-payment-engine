import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    gateway: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    error: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const paymentSchema = new mongoose.Schema(
    {
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            default:"INR",
        },
        userId:{
            type:String,
            required:true
        },
        paymentMethod:{
            type:String,
            enum:["UPI", "CARD"],
            required:true
        },
        status:{
            type:String,
            enum:["CREATED", "PROCESSING", "SUCCESS","FAILED"],
            default:"CREATED",
        },
        gatewayUsed:{
            type:String,
        },
        attempts:[attemptSchema],
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);