import express from "express";
import { allJob, applyJob, createJob, selectDriver } from "../controllers/job.js";
import { auth } from "../middleware/auth.js";

const jobRouter = express.Router()
jobRouter.post('/createJob',auth,createJob)
jobRouter.get('/allJob',auth,allJob)
jobRouter.post('/applyJob/:id',auth,applyJob)
jobRouter.post('/selectDriver',auth,selectDriver)

export default jobRouter