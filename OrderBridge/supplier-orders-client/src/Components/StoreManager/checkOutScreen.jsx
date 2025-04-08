import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import NavBarStoreManager from './NavBarStoreManager';
import { useGetStoreGoodsQuery, useCheckStockAndOrderMutation } from '../storeGoodsApiSlice';
import './checkOutScreen.css';
import io from 'socket.io-client';
const CheckOutScreen = () => {
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
    const { data: storeGoods, isSuccess: isSuccessStoreGood, refetch, isLoading } = useGetStoreGoodsQuery();
    const [buyStoreGood, { isSuccess }] = useCheckStockAndOrderMutation();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:5000');
        let isMounted = true;
        socket.on('storeProduct-added', async (message) => {
            console.log('storeProduct-added');
            console.log("storeProduct-added:", message);
            if (isMounted) {
                await refetch(); 
            }
        });
        return () => {
            isMounted = false;
            socket.disconnect();
        };
    }, [refetch]); 
    useEffect(() => {
        if (isSuccessStoreGood && storeGoods && storeGoods.data) {
            setProducts(storeGoods.data);
        }
    }, [storeGoods, isSuccessStoreGood]);
    const handleProductSelection = (e, product) => {
        if (e.target.checked) {
            setSelectedProducts((prevSelected) => [...prevSelected, { ...product, quantity: 1 }]);
        } else {
            setSelectedProducts((prevSelected) => prevSelected.filter((item) => item._id !== product._id));
        }
    };

    const handleQuantityChange = (e, product) => {
        const updatedProducts = selectedProducts.map((item) =>
            item._id === product._id ? { ...item, quantity: e.value } : item
        );
        setSelectedProducts(updatedProducts);
    };

    const handleOrder = async () => {
        let hasError = false;

        for (let product of selectedProducts) {
            try {
                const response = await buyStoreGood({ goodId: product._id, quantity: product.quantity }).unwrap();
                const { quantitySold, orderPlaced, quantityOrdered } = response;
                let alertMsg = `המוצר "${product.productName}" נמכר בהצלחה.`;
                if (quantitySold < product.quantity) {
                    alertMsg = `המוצר "${product.productName}" נמכר חלקית (${quantitySold} מתוך ${product.quantity}).`;
                }
                if (orderPlaced) {
                    alertMsg += `\nבוצעה הזמנה של ${quantityOrdered} יחידות כי הכמות ירדה מהמינימום.`;
                }
                alert(alertMsg);
            } catch (error) {
                console.error('Error during order:', error);
                hasError = true;
                if (error?.data?.message === 'No suppliers found for this product') {
                    alert(`לא ניתן להזמין את המוצר "${product.productName}" – אין ספק זמין עבור מוצר זה.`);
                } else {
                    alert(`אירעה שגיאה בהזמנת המוצר "${product.productName}".`);
                }
            }
        }
        await refetch(); 
        setSelectedProducts([]);
    };



    return (
        <div className="p-4">
            <NavBarStoreManager />
            <h2>רשימת מוצרים</h2>
            <DataTable value={products} paginator rows={10} className="p-datatable-striped">
                <Column field="price" header="מחיר" />
                <Column
                    header="כמות"
                    body={(rowData) => {
                        const isProductSelected = selectedProducts.some(item => item._id === rowData._id);
                        return (
                            <InputNumber
                                value={isProductSelected ?
                                selectedProducts.find(item => item._id === rowData._id)?.quantity || 1 : null}
                                onValueChange={(e) => handleQuantityChange(e, rowData)}
                                min={0}
                                //max= {rowData.currentQuantity}
                                showButtons
                                disabled={!isProductSelected} 
                            />
                        );
                    }}
                />
                <Column field="productName" header="שם מוצר" />
                <Column field="_id" header="מזהה" />
                <Column
                    body={(rowData) => (
                        <div>
                            <input
                                type="checkbox"
                                onChange={(e) => handleProductSelection(e, rowData)}
                                checked={selectedProducts.some(item => item._id === rowData._id)} 
                            />
                        </div>
                    )}
                    header="בחר"
                />
            </DataTable>
            <div className="mt-4">
                <h3>המוצרים שנבחרו:</h3>
                <ul>
                    {selectedProducts.map((product) => (
                        <li key={product._id}>
                            {product.productName} - ₪{product.price} - כמות: {product.quantity}
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleOrder} className="p-button p-button-success mt-4">
                בצע הזמנה
            </button>
        </div>
    );
};

export default CheckOutScreen;
