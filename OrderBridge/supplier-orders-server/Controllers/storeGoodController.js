const StoreGood=require('../Models/StoreGood')
const Supplier=require('../Models/Supplier')
const{createOrder}=require('../Controllers/orderController')
let ioInstance = null;
const setSocketIO = (ioFromServer) => {
  ioInstance = ioFromServer;
};

const checkStockAndOrder = async (req, res) => {
    try {
        const storeGoodId = req.params.goodId;
        const { quantity } = req.body;
        const storeGood = await StoreGood.findById(storeGoodId);

        if (!storeGood) {
            return res.status(404).json({ message: 'StoreGood not found' });
        }
        
        let quantityToSell = 0;
        let orderPlaced = false;
        let quantityToOrder = 0;

        quantityToSell = Math.min(storeGood.currentQuantity, quantity);
        storeGood.currentQuantity -= quantityToSell;
        await storeGood.save();

        if (storeGood.currentQuantity < storeGood.minQuantity) {

            const suppliers = await Supplier.find()
                .populate('goods.goodsId')
                .then(suppliers => {
                    return suppliers.filter(supplier =>
                        supplier.goods.some(good =>
                            good.goodsId && good.goodsId.productName === storeGood.productName
                        )
                    );
                });

            if (!suppliers || suppliers.length === 0) {
                return res.status(404).json({ message: 'No suppliers found for this product' });
            }

            const bestPriceSupplier = suppliers.reduce((best, current) => {
                return current.price < best.price ? current : best;
            });

            const supplierGood = bestPriceSupplier.goods.find(good => good.goodsId.productName === storeGood.productName);
            if (!supplierGood) {
                return res.status(404).json({ message: 'Supplier product not found for the given product' });
            }

            const minPurchaseQuantity = supplierGood.goodsId.minQuantity;
            const missingQuantity = quantity - quantityToSell;
            const quantityNeededForStock = storeGood.minQuantity - storeGood.currentQuantity;
             quantityToOrder = Math.max(missingQuantity, quantityNeededForStock, minPurchaseQuantity);
            const orderReq = {
                body: {
                    supplierId: bestPriceSupplier._id,
                    items: [{ productId: supplierGood.goodsId._id, quantity: quantityToOrder }]
                },
                user: req.user
            };
            await createOrder(orderReq);
            
            orderPlaced = true;
        }
        return res.status(200).json({
            message: `Process completed.`,
            quantitySold: quantityToSell,
            orderPlaced,
            quantityOrdered: orderPlaced ? quantityToOrder : 0
        });

    } catch (error) {
        console.error('Error in checkStockAndOrder:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const createStoreGood = async (req, res) => {
    const { productName, price, minQuantity } = req.body;
    const {_id}=req.user
    if (!productName || !price || !minQuantity) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const existingGood = await StoreGood.findOne({ productName });
        if (existingGood) {
            return res.status(409).json({ error: true, message: "Product already exists in stock" });
        }
        const newStoreGood = new StoreGood({
            productName,
            price,
            minQuantity,
            currentQuantity: 0 ,
            storeManager:_id
        });

        await newStoreGood.save();
        if (ioInstance) {
            ioInstance.emit('storeProduct-added', 'מוצר חדש נרשם!');
          }
        res.status(201).json({
            success: true,
            message: "Store good created successfully",
            data: newStoreGood
        });
    } catch (error) {
        console.error("Error creating store good:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};

const getStoreGoodsByManager = async (req, res) => {
    const managerId = req.user._id; 
    try {
        const storeGoods = await StoreGood.find({ storeManager: managerId });

        if (!storeGoods || storeGoods.length === 0) {
            return res.status(404).json({ message: 'No products found for this manager' });
        }
        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: storeGoods
        });
    } catch (error) {
        console.error("Error retrieving store goods:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
};

module.exports={checkStockAndOrder,createStoreGood,getStoreGoodsByManager,setSocketIO}