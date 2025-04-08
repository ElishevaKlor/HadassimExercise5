const Good=require("../Models/Good")
const Supplier=require("../Models/Supplier")
const addGoods = async (req, res) => {
    const { productName, price, minQuantity,imgUrl } = req.body;
    const supplierId = req.user._id;
    if (!productName || !price || !minQuantity ||!supplierId) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }
  
    try {
        const existingGood = await Good.findOne({ productName: productName });
        if (existingGood) {
            return res.status(400).json({ error: true, message: "Product with this name already exists" });
        }
      const newGood = new Good({ productName, price, minQuantity, imgUrl });
      await newGood.save(); 

      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ error: true, message: "Supplier not found" });
      }

      supplier.goods.push({ goodsId: newGood._id });
      await supplier.save();

      return res.status(201).json({ error: false, message: "Product added successfully", data: newGood });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Server error" });
    }
};

  module.exports={addGoods}
  