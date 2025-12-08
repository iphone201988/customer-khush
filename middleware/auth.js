import JWT from "jsonwebtoken"

export const auth = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(400).json({
            message:"authHeader is missing"
        })
    }
    const parts = authHeader.split(" ")
    if(parts.length !== 2 || parts[0] !== "Bearer"){
        return res.status(400).json({
            message:"auth format is incorrect"
        })
    }
    const token = parts[1]
    if(!token){
        return res.status(400).json({
            message:"Token is missing"
        })
    }
    const decode = JWT.verify(token,process.env.SECRET)
    req.user = decode
    next()
    } catch (error) {
        return res.status(400).json({
            error:error.message
        })
    }
}