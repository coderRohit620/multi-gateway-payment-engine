import mongoose from "mongoose";

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
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);