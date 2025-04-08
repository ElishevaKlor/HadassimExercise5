import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import Loading from '../Loading';
const SupplierProductsDialog = ({
  isOpen,
  onClose,
  selectedSupplier,
  products,
  isLoading,
  selectedQuantities,
  onQuantityChange,
  onAddToOrder,
  orderItems,
  calculateTotalOrderPrice,
  handlePlaceOrder
}) => {

  const productQuantityTemplate = (product) => {
    const quantity = selectedQuantities[product._id] || 1;
    return (
      <InputNumber
        value={quantity}
        onValueChange={(e) => onQuantityChange(product, e.value)}
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

  const productActionTemplate = (product) => {
    const selectedItem = orderItems.find(item => item.product._id === product._id);
    const isSelected = Boolean(selectedItem);
    const quantity = selectedQuantities[product._id] || 1;

    return (
      <Button
        label={isSelected ? 'הסר' : 'הוסף'}
        onClick={() => onAddToOrder(product, quantity)}
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
      <span style={{ fontWeight: 'bold', marginRight: '20px', marginTop: '10px' }}>
        סה"כ להזמנה: ₪{calculateTotalOrderPrice().toFixed(2)}
      </span>
    </div>
  );

  return (
    <Dialog
      header={`מוצרים של ${selectedSupplier?.company || ''}`}
      visible={isOpen}
      onHide={onClose}
      style={{ width: '80vw', maxWidth: '1000px' }}
      footer={dialogFooter}
      className="supplier-dialog"
      dir="rtl"
    >
      {isLoading ? (
        <Loading />
      ) : (
        <DataTable headerStyle={{ textAlign: 'right' }} value={products} responsiveLayout="scroll" emptyMessage="אין מוצרים זמינים עבור ספק זה">
          <Column style={{ textAlign: 'right'}} field="productName" header="שם מוצר" />
          <Column style={{ textAlign: 'right' }} field="price" header="מחיר ליחידה" body={(data) => `₪${data.price}`} />
          <Column style={{ textAlign: 'right' }} body={productQuantityTemplate} header="כמות" />
          <Column style={{ textAlign: 'right' }} body={productTotalTemplate} header="סהכ" />
          <Column style={{ textAlign: 'right' }} body={productActionTemplate} header="פעולה" />
        </DataTable>
      )}
    </Dialog>
  );
};

export default SupplierProductsDialog;