import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema(
    {
        key:{
            type:String,
            required : true,
            unique: true,
            trim : true,
            index: true,
        },
        paymentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Payment",
            required:true,
        }, 
        statusCode:{
            type: Number,
            required: true,
        },
        response:{
            type: mongoose.Schema.Types.Mixed,
            required:true,
        },

    },  { timestamps: true }
    // key,
    // paymentId,
    // response,
    // statusCode,
    // createdAt
);

const Idempotency = mongoose.model("Idempotency", idempotencySchema);

export default Idempotency;
