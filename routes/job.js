import express from "express";
import { allJob, applyJob, createJob, deleteJob, getJobById, selectDriver, taskCompleteStatus, updateJob } from "../controllers/job.js";
import { auth } from "../middleware/auth.js";
import { validation } from "../middleware/validation.js";
import { applyJobParamSchema,createJobSchema,selectDriverQuerySchema,taskCompleteQuerySchema } from "../schema/job.schema.js";
import { upload } from "../middleware/multer.js";

const jobRouter = express.Router()
jobRouter.post('/createJob',validation(createJobSchema),auth,createJob)
jobRouter.get('/allJob',auth,allJob)
jobRouter.post('/applyJob/:id',validation(applyJobParamSchema),auth,applyJob)
jobRouter.post('/selectDriver',validation(selectDriverQuerySchema),auth,selectDriver)
jobRouter.post('/taskCompleteStatus',upload.single("image"),validation(taskCompleteQuerySchema),auth,taskCompleteStatus)
jobRouter.post('/updateJob/:id',auth,updateJob)
jobRouter.post('/deleteJob/:id',auth,deleteJob)
jobRouter.get('/getJobById/:id',auth,getJobById)

export default jobRouter