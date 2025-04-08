
const verifyAdmin=(req,res,next)=>{
 if (req.user?.role !== "storeManager") 
    return res.status(401).json({error:true,message:"UnAuthorized Admin",data:null})
    
    next()
    }
module.exports=verifyAdmin