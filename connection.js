import mongoose from "mongoose";

export async function connectMongoDB(url) {
    await mongoose.connect(url).then(()=>{
        console.log("MongoDB Connected")
    })
}