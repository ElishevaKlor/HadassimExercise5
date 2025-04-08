const bcrypt=require("bcrypt")
const Supplier=require("../Models/Supplier")
const Good=require("../Models/Good")
let ioInstance = null;
const setSocketIO = (ioFromServer) => {
  ioInstance = ioFromServer;
};
const addSupplier=async(req,res)=>{
    const {representativeName,password,phone,email,company,items}=req.body
    if(!password||!representativeName)
        return res.status(400).json({error:true,message:"you are missing some required fields",data:null})
const duplicate=await Supplier.findOne({company}).lean()
if(duplicate)
    return res.status(400).json({error:true,message:"there is already exist a user by this name",data:null})
const hashedpassword=await bcrypt.hash(password,10)
   const supplier=await Supplier.create({password:hashedpassword,representativeName,phone,email,company,items,role:'supplier'})
   if(!supplier)
   return res.status(400).json({error:true,message:"create failed",data:null})
   if (ioInstance) {
    ioInstance.emit('supplier-added', 'ספק חדש נרשם!');
  }
   return res.status(201).json({error:false,message:"",data:supplier})
  

}
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().lean(); 
        return res.status(200).json({ error: false, data: suppliers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
};
const getSupplierGoods = async (req, res) => {

    const { supplierId } = req.params; 
    try {
        const supplier = await Supplier.findById(supplierId)
            .populate('goods.goodsId') 
            .lean(); 

        if (!supplier) {
            return res.status(404).json({ error: true, message: 'Supplier not found' });
        }

        const goods = supplier.goods.map(good => good.goodsId);
        return res.status(200).json({ error: false, data: goods });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: 'Server error' });
    }
};

module.exports = { addSupplier, getAllSuppliers, getSupplierGoods,setSocketIO };




