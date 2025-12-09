import { Job } from "../models/job.js";
import { ErroHandler } from "../utils/errorHandler.js";

export async function createJob(req, res,next) {
  try {
    const customerId = req.user.id;
    const role = req.user.role;
    console.log(role);
    if (role == "Driver") {
      // return res.status(400).json({
      //   message: "You are not able to create job",
      // });
      return next(new ErroHandler("You are not able to create job", 400))
    }
    const { title, pickup, drop, amount } = req.body;
    const job = await Job.create({
      title,
      pickup,
      drop,
      amount,
      customerId,
    });
    return res.status(200).json({
      message: "Job successfully created",
      job
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function updateJob(req, res,next) {
  try {
    const userId = req.user.id
    const role = req.user.role;
    if (role != "Customer") {
      // return res.status(400).json({
      //   message: "Only customer can update a job",
      // });
      return next(new ErroHandler("Only customer can update a job", 400))
    }
    const { id } = req.params;
    const { title, pickup, drop, amount } = req.body;
    let updatedData = {
      title,
      pickup,
      drop,
      amount,
    };
    // What if the job is not created by me?
    const job = await Job.findOneAndUpdate({ _id: id,userId }, updatedData, {
      new: true,
      runValidators: true,
    });
    console.log(job)
    if (!job) {
      // return res.status(400).json({
      //   message: "Job not found",
      // });
      return next(new ErroHandler("Job not found", 400))
    }
    return res.status(200).json({
      message: "Job updated",
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function deleteJob(req,res,next) {
  try {
    console.log(req.params)
    const userId = req.user.id
    const role = req.user.role
  if(role!= "Customer"){
    // return res.status(400).json({
    //   message:"only customer can delete job"
    // })
    return next(new ErroHandler("Only Customer can delete a job", 400))
  }
  const {id} = req.params
     // What if the job is not created by me?
  const job = await Job.findOneAndUpdate({_id:id,userId},{isDeleted:true},{new:true})
  if(!job){
    // return res.status(400).json({
    //   message:"job not found"
    // })
    return next(new ErroHandler("Job not found", 400))
  }
  return res.status(200).json({
    message:"Job Delete Successfully"
  })
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function allJob(req, res,next) {
  try {
    const role = req.user.role;
    if (role != "Driver") {
      // return res.status(400).json({
      //   message: "only driver have access of jobs ",
      // });
      return next(new ErroHandler("only driver have access of jobs", 400))
    }
       // What if the driver is selcted to job is completed already?
    const job = await Job.find({isDeleted:false,taskStatus:"inprogress"});
    return res.status(200).json({
      message: "All Jobs",
      job,
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function applyJob(req, res,next) {
  try {
    const { id } = req.params;
    console.log(id);
    const driverId = req.user.id;
    const role = req.user.role;
    if (role !== "Driver") {
      // return res.status(200).json({
      //   message: "Only driver can apply for job",
      // });
      return next(new ErroHandler("Only driver can apply for job", 400))
    }
    const job = await Job.findById(id);
    console.log(job.JobStatus);
    if (job.JobStatus != "available") {
      // return res.status(400).json({
      //   message: "job is not available",
      // });
      return next(new ErroHandler("job is not available", 400))
    }
    // What if driver already applied on it?
    const alreadyApplied = job.applyStatus.find((d) => d === driverId)
    if(alreadyApplied){
      // return res.status(400).json({
      //   message:"you are already applied"
      // })
      return next(new ErroHandler("you are already applied", 400))
    }
    job.applyStatus.push(driverId);
    await job.save();
    return res.status(200).json({
      message: "job applied",
      job,
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function selectDriver(req, res,next) {
  try {
    const { id } = req.query;
    const { driverId } = req.query;
    const role = req.user.role;
    console.log(role);
    if (role != "Customer") {
      // return res.status(400).json({
      //   message: "only customer can select the driver",
      // });
      return next(new ErroHandler("only customer can select the driver", 400))
    }
    const job = await Job.findById(id);
    // What if job not found?
    if(!job){
      // return res.status(400).json({
      //   message:"job not found"
      // })
      return next(new ErroHandler("job not found", 400))
    }
    const selectedOne = job.applyStatus.find((d) => d === driverId);
    // What if you don't find that driver here?
    if(!selectedOne){
      // return res.status(400).json({
      //   message:"Driver not found"
      // })
      return next(new ErroHandler("driver not found", 400))
    }
    job.selectedDriver = selectedOne;
    job.JobStatus = "unavailable";
    await job.save();

    return res.status(200).json({
      message: "driver selected",
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}

export async function taskCompleteStatus(req, res,next) {
  try {
    const role = req.user.role;
    if (role != "Driver") {
      // return res.status(400).json({
      //   message: "Only Driver can do that",
      // });
      return next(new ErroHandler("only driver can do that", 400))
    }
    const { id } = req.query;
    let taskImage = null;
    if (req.file) {
      taskImage = `image/${req.file.filename}`;
    }
    // No image
    if(!taskImage){
      // return res.status(400).json({
      //   message:"pliz enter image"
      // })
      return next(new ErroHandler("please enter a image", 400))
    }
    const job = await Job.findById(id);
    // no job
    if(!job){
      // return res.status(400).json({
      //   message:"job not found"
      // })
      return next(new ErroHandler("Job Not Found", 400))
    }
    job.taskImage = taskImage;
    job.taskStatus = "completed";
    await job.save();
    return res.status(200).json({
      message: "Task Complete",
    });
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}


/// getJObBYId
export async function getJobById(req,res,next) {
  try {
    
    const role = req.user.role
    if(role!="Driver"){
      // return req.status(400).json({
      //   message:"only driver can get job"
      // })
      return next(new ErroHandler("only driver cam get job", 400))
    }
    const {id} = req.params
  const job = await Job.findById(id,{isDeleted:false})
  if(!job){
    // return res.status(200).json({
    //   message:"job not found",
    // })
    return next(new ErroHandler("job Not Found", 400))
  }
  return res.status(200).json({
    message:"Job",
    job
  })
  } catch (error) {
    // return res.status(400).json({
    //   error: error.message,
    // });
    next(error)
  }
}