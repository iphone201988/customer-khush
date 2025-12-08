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
    }
},{timestamps:true})

export const Job = model("job",jobSchema)