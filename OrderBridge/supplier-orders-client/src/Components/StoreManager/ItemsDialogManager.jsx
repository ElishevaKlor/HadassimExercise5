import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ItemsDialog = ({ visible, onHide, selectedOrder }) => {
    return (
        <Dialog
            header="מוצרים בהזמנה"
            visible={visible}
            style={{ width: '80vw', maxWidth: '1000px' }}
            onHide={onHide}
            contentStyle={{ direction: 'rtl' }}
        >
            {selectedOrder?.items?.length > 0 ? (
                <DataTable
                    value={selectedOrder.items}
                    responsiveLayout="scroll"
                    style={{ direction: 'rtl' }}
                    emptyMessage="אין מוצרים בהזמנה זו"
                    headerStyle={{ textAlign: 'right' }}
                >
                    <Column
                        field="goodsId.productName"
                        header="שם מוצר"
                        body={(item) => item.goodsId?.productName || '—'}
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        field="quantity"
                        header="כמות"
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        field="goodsId.price"
                        header="מחיר ליחידה (₪)"
                        body={(item) => `${item.goodsId?.price || 0} ₪`}
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        header="סה״כ (₪)"
                        body={(item) => {
                            const price = item.goodsId?.price || 0;
                            const quantity = item.quantity || 0;
                            const total = price * quantity;
                            return `${total.toFixed(2)} ₪`;
                        }}
                        style={{ textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}
                    />
                </DataTable>
            ) : (
                <p style={{ textAlign: 'center' }}>אין מוצרים בהזמנה זו.</p>
            )}
        </Dialog>
    );
};

export default ItemsDialog;
