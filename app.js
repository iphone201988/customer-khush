import express from "express";
import "dotenv/config"
import { connectMongoDB } from "./connection.js";
import userRouter from "./routes/user.js";
import jobRouter from "./routes/job.js";
import { errorMiddleware } from "./middleware/errorHandler.middleware.js";

const app = express()
const PORT=process.env.PORT
connectMongoDB(process.env.MONGO_DB)

app.use(express.json())
app.use('/user',userRouter)
app.use('/job',jobRouter)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})