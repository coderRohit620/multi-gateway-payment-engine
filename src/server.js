import dotenv from "dotenv"
import connectDB from "./config/db.js"
import { app } from "./app.js"

dotenv.config({path: "./.env"})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`Server is running at port :${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MoNGO db connection failed !!!", err);
        process.exit(1);
    });


/*
import express from "express"
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/{DB_NAME}`)
        app.on("error", (error) =>{
            console.log("ERROR",error);
            throw error
        })

        app.listen(process.env.PORT, () =>{
            console.log(`App is Listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR",error)
        throw err
    }
})()
*/