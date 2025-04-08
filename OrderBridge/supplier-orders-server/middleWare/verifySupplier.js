
const verifySupplier=(req,res,next)=>{
    if(!req.user?.role==="supplier")
    return res.status(401).json({error:true,message:"UnAuthorized supplier",data:null})
    next()
    }
    module.exports=verifySupplier