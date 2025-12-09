import { model,Schema } from "mongoose";

const jobSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    pickup:{
        type:String,
        required:true
    },
    drop:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    applyStatus:{
        type:[String]
    },
    selectedDriver:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    JobStatus:{
        type:String,
        enum:["available","unavailable"],
        default:"available"
    },
    taskStatus:{
        type:String,
        enum:["inprogress","completed"],
        default:"inprogress"
    },
    taskImage:{
        type:String
    },
    isDeleted:{
        type:Boolean
    }
},{timestamps:true})

export const Job = model("job",jobSchema)