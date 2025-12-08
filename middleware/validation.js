export const validation = (Schema)=>{
    return (req,res,next) =>{
        const data = {...req.body,...req.query}
        const {error} = Schema.validate(data)
        if(error){
            return res.status(400).json({
                message:error.details[0].message
            })
        }
        next()
    }
}