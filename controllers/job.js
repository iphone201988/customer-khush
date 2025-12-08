import { Job } from "../models/job.js";

export async function createJob(req, res) {
  try {
    const customerId = req.user.id;
    const role = req.user.role;
    console.log(role);
    if (role == "Driver") {
      return res.status(400).json({
        message: "You are not able to create job",
      });
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
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function allJob(req, res) {
  try {
    const job = await Job.find({});
    return res.status(200).json({
      message: "All Jobs",
      job,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function applyJob(req, res) {
  try {
    const { id } = req.params;
    console.log(id);
    const driverId = req.user.id;
    const role = req.user.role;
    if (role !== "Driver") {
      return res.status(200).json({
        message: "Only driver can apply for job",
      });
    }
    const job = await Job.findById(id);
    console.log(job.JobStatus);
    if (job.JobStatus != "available") {
      return res.status(400).json({
        message: "job is not available",
      });
    }
    job.applyStatus.push(driverId);
    await job.save();
    return res.status(200).json({
      message: "job applied",
      job,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function selectDriver(req, res) {
  try {
    const { id } = req.query;
    const { driverId } = req.query;
    const role = req.user.role;
    console.log(role)
    if (role != "Customer") {
      return res.status(400).json({
        message: "only customer can select the driver",
      });
    }
    const job = await Job.findById(id);
    const selectedOne = job.applyStatus.find((d) => d === driverId);
    job.selectedDriver = selectedOne;
    job.JobStatus = "unavailable";
    await job.save();

    return res.status(200).json({
      message: "driver selected",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

