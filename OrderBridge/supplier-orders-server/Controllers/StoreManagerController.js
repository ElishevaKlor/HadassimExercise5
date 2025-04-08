const bcrypt=require("bcrypt")
const StoreManager=require("../Models/StoreManager")
const addStoreManager=async(req,res)=>{
    const {representativeName:name,password,phone,suppliers,adminCode}=req.body
    if (!adminCode || adminCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid admin code" });
    }
   if(!password||!name)
   return res.status(400).json({error:true,message:"you are missing some required fields",data:null})
const duplicate=await StoreManager.findOne({name}).lean()
if(duplicate)
    return res.status(400).json({error:true,message:"there is already exist a user by this name",data:null})
const hashedpassword=await bcrypt.hash(password,10)
   const storeManager=await StoreManager.create({password:hashedpassword,name,phone,suppliers,role:'admin'})
   if(!storeManager)
   return res.status(400).json({error:true,message:"create failed",data:null})

   return res.status(201).json({error:false,message:"",data:storeManager})
}

module.exports = {addStoreManager};