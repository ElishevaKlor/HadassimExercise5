import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { useGetSupplierGoodsQuery, useGetSuppliersQuery } from '../SupplierApiSlice';
import { useCreateOrderMutation } from '../OrderApiSlice';
import './OrdersFromSupplierPage.css';
import NavBarStoreManager from './NavBarStoreManager';
import io from 'socket.io-client';
import Loading from '../Loading';
import SupplierProductsDialog from './SupplierProductsDialog';
const OrderFromSupplierPage = () => {
  const { data: suppliersData, error, isLoading, refetch } = useGetSuppliersQuery();
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const { data: supplierGoods, isLoading: isGoodsLoading } = useGetSupplierGoodsQuery(
    { _id: selectedSupplier?._id },
    { skip: !selectedSupplier }
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [createOrder] = useCreateOrderMutation();
  const toast = useRef(null);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('supplier-added', (message) => {
      refetch();
    });
    return () => {
      socket.off('supplier-added');
    };
  }, []);

  const handleSupplierSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleAddToOrder = (product, quantity) => {
    if (quantity < product.minQuantity) {
      toast.current.show({
        severity: 'error',
        summary: 'כמות מינימלית לא הושגה',
        detail: `הכמות המינימלית להזמנה היא ${product.minQuantity}`,
        life: 3000,
      });
      return;
    }

    const existingItem = orderItems.find(item => item.product._id === product._id);

    if (existingItem) {
      const updatedItems = orderItems.filter(item => item.product._id !== product._id);
      setOrderItems(updatedItems);
    } else {
      setOrderItems([...orderItems, { product, quantity }]);
    }
  };

  const handleQuantityChange = (product, newQuantity) => {
    setSelectedQuantities({ ...selectedQuantities, [product._id]: newQuantity });
    const updatedItems = orderItems.filter(item => item.product._id !== product._id);
    setOrderItems(updatedItems);
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedSupplier || orderItems.length === 0) {
        console.error("No supplier selected or no items in order");
        return;
      }

      const orderPayload = {
        supplierId: selectedSupplier._id,
        items: orderItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderPayload).unwrap();
      setOrderItems([]);
      setSelectedQuantities({});
      setSelectedSupplier(null);
      setIsDialogOpen(false);
      toast.current.show({
        severity: 'success',
        summary: 'ההזמנה בוצעה בהצלחה!',
        detail: 'ההזמנה נשלחה בהצלחה לספק.',
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const suppliers = suppliersData?.data || [];
  const products = supplierGoods?.data || [];
  console.log(products)
  const productQuantityTemplate = (product) => {
    const quantity = selectedQuantities[product._id] || 1;
    return (
      <InputNumber
        value={quantity}
        onValueChange={(e) => handleQuantityChange(product, e.value)}
        min={1}
        showButtons
        className="quantity-input"
        style={{ width: '80px' }}
      />
    );
  };
  const productTotalTemplate = (product) => {
    const quantity = selectedQuantities[product._id] || 1;
    const totalPrice = product.price * quantity;
    return `₪${totalPrice.toFixed(2)}`;
  };
  const calculateTotalOrderPrice = () => {
    return orderItems.reduce((total, item) => {
      const quantity = selectedQuantities[item.product._id] || 1;
      return total + (item.product.price * quantity);
    }, 0);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSupplier(null);
  };
  const productActionTemplate = (product) => {
    const selectedItem = orderItems.find(item => item.product._id === product._id);
    const isSelected = Boolean(selectedItem);
    const quantity = selectedQuantities[product._id] || 1;

    return (
      <Button
        label={isSelected ? 'הסר' : 'הוסף'}
        onClick={() => handleAddToOrder(product, quantity)}
        icon={isSelected ? 'pi pi-cart-minus' : 'pi pi-cart-plus'}
        className={`p-button-sm ${isSelected ? 'p-button-success' : 'p-button-outlined'}`}
        style={{
          backgroundColor: isSelected ? '#28a745' : '#007bff',
          color: '#fff',
          borderRadius: '0',
          width: '80px',
        }}
      />
    );
  };

  const dialogFooter = (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button label="בצע הזמנה" onClick={handlePlaceOrder} className="p-button-success" disabled={!orderItems.length} />
      <span style={{ fontWeight: 'bold', marginRight: "20px", marginTop: "10px" }}>
        סה"כ להזמנה: ₪{calculateTotalOrderPrice().toFixed(2)}
      </span>
    </div>
  );

  return (
    <div style={{ paddingTop: '50px' }}>
      <NavBarStoreManager />
      <h1>הזמנת סחורה מספק</h1>
      <DataTable headerStyle={{ textAlign: 'right' }} value={suppliers} className="suppliers-table" dir="rtl" autoLayout>
        <Column
          body={(rowData) => (
            <Checkbox
              inputId={`supplier-${rowData._id}`}
              checked={selectedSupplier?._id === rowData._id}
              onChange={() => handleSupplierSelect(rowData)}
              //style={{ textAlign: 'right' }}
            />
          )}
          style={{ textAlign: 'right' }}
          header="בחר ספק"
        />
        <Column style={{ textAlign: 'right' }}field="company" header="שם חברה" />
        <Column style={{ textAlign: 'right' }}field="representativeName" header="איש קשר" />
        <Column style={{ textAlign: 'right' }}field="phone" header="טלפון" />
      </DataTable>

      <SupplierProductsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedSupplier={selectedSupplier}
        products={products}
        isLoading={isGoodsLoading}
        selectedQuantities={selectedQuantities}
        onQuantityChange={handleQuantityChange}
        onAddToOrder={handleAddToOrder}
        orderItems={orderItems}
        calculateTotalOrderPrice={calculateTotalOrderPrice}
        handlePlaceOrder={handlePlaceOrder}
      />

      <Toast ref={toast} />
    </div>
  );
};

export default OrderFromSupplierPage;
