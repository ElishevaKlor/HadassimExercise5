import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useGetOrderStatusesQuery } from '../OrderApiSlice';
import 'primeicons/primeicons.css';
import NavBarStoreManager from './NavBarStoreManager';
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import './OrdersPage.css';
import io from 'socket.io-client';
import { Tooltip } from 'primereact/tooltip';
import { Calendar } from 'primereact/calendar';
import './OrdersPage.css'
import Loading from '../Loading';
import ItemsDialog from './ItemsDialogManager';
const OrdersPage = () => {
    dayjs.locale('he');
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);
    const { data: ordersData, error, isLoading, isSuccess, refetch } = useGetOrdersQuery({
        skip: !isInitialLoadDone
    });
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
    const [isItemsDialogVisible, setIsItemsDialogVisible] = useState(false);
    const { data: statusesData, error: statusesError, isLoading: statusesLoading } = useGetOrderStatusesQuery();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (isSuccess && ordersData) {
            const sorted = [...ordersData.orders].sort((a, b) => new Date(b.date) - new Date(a.date));
            const filtered = sorted.filter(order => {
                const orderDate = new Date(order.date);
                const isAfterStartDate = startDate ? orderDate >= new Date(startDate) : true;
                const endDateWithTime = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : true;
                const isBeforeEndDate = endDate ? orderDate <= endDateWithTime : true;
                return isAfterStartDate && isBeforeEndDate;
            });

            setSortedOrders(filtered);
        }
    }, [isSuccess, ordersData, startDate, endDate]);


    useEffect(() => {
        const socket = io('http://localhost:5000');
        let isMounted = true;
        socket.on('order-added', (message) => {
            console.log("Order added:", message);
            if (isMounted) {
                refetch();
            }
        });
        return () => {
            isMounted = false;
            socket.off('order-added');
            socket.disconnect();
        };
    }, [refetch]);

    const formatDateHebrew = (dateString) => {
        return dayjs(dateString).format('dddd, D MMMM YYYY');
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || selectedStatus === selectedOrder.status) return;

        try {
            if (selectedStatus === 'completed' && selectedOrder.status === 'in process') {
                await updateOrderStatus({ orderId: selectedOrder._id, status: selectedStatus });
                setSelectedOrder({ ...selectedOrder, status: selectedStatus });
                setIsStatusDialogVisible(false);
            }
        } catch (error) {
            console.error('שגיאה בשינוי סטטוס:', error);
        }
    };

    const statusBodyTemplate = (rowData) => {
        const statusColors = {
            'waiting': 'red',
            'in process': 'orange',
            'completed': 'green'
        };

        const iconColor = statusColors[rowData.status] || 'gray';
        const statusText = {
            'waiting': 'ממתין',
            'in process': 'בתהליך',
            'completed': 'הושלם'
        };

        return (
            <div
                style={{ itemAlign: 'left', display: 'flex',  cursor: 'pointer' }}
                onClick={() => {
                    setSelectedOrder(rowData);
                    setSelectedStatus(rowData.status);
                    setIsStatusDialogVisible(true);
                }}
            >
                <i
                    className="pi pi-eye"
                    style={{ fontSize: '1.5em', marginRight: '8px', color: iconColor }}
                    data-pr-tooltip={`סטטוס נוכחי: ${statusText[rowData.status]}`}
                    data-pr-position="top"
                />
                <Tooltip target=".pi-eye" position="top" />
            </div>
        );
    };
    const viewItemsButtonTemplate = (rowData) => (
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => {
            setSelectedOrder(rowData);
            setIsItemsDialogVisible(true);
        }}>
            <i className="pi pi-list" style={{ fontSize: '1.5em', marginRight: '8px', color: '#007ad9' }} />
        </div>
    );

    const communicationButtonTemplate = (rowData) => (
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => {
            setSelectedOrder(rowData);
            setIsDialogVisible(true);
        }}>
            <i className="pi pi-eye icon-table" style={{ fontSize: '1.5em', marginRight: '8px', color: '#007ad9' }} />
        </div>
    );

    const renderStatusIcons = (order) => {
        if (!order || statusesLoading || statusesError || !statusesData || statusesData.length === 0) return null;

        const statusSteps = statusesData.map(step => ({
            ...step,
            icon: {
                'waiting': 'pi pi-shopping-cart',
                'in process': 'pi pi-box',
                'completed': 'pi pi-truck'
            }[step.key]
        })).reverse();

        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {statusSteps.map((step, index) => {
                        const iconName = step.icon || "pi pi-question-circle";
                        const isCurrentStatus = order.status === step.key;
                        const isSelected = selectedStatus === step.key;
                        const isClickable = step.key === 'completed' && order.status === 'in process';

                        return (
                            <div key={step.key} style={{ textAlign: 'center', margin: '0 20px' }}>
                                <i
                                    className={iconName}
                                    style={{
                                        fontSize: '3em',
                                        color: isSelected ? '#007ad9' : 'gray',
                                        cursor: isClickable ? 'pointer' : 'not-allowed'
                                    }}
                                    onClick={() => {
                                        if (isClickable) setSelectedStatus(step.key);
                                    }}
                                />
                                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{step.label}</p>
                                {index < statusSteps.length - 1 && (
                                    <span
                                        style={{
                                            display: 'block',
                                            width: '40px',
                                            height: '3px',
                                            backgroundColor: isSelected ? '#007ad9' : 'lightgray',
                                            margin: '10px auto',
                                        }}
                                    ></span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button
                        label="עדכן סטטוס"
                        icon="pi pi-check"
                        onClick={handleUpdateStatus}
                        disabled={selectedStatus === order.status}
                    />
                </div>
            </div>
        );
    };

    const amountBodyTemplate = (rowData) => `₪ ${rowData.totalAmount}`;

    return (

        <div style={{ paddingTop: "50px", backgroundColor: 'white', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavBarStoreManager />
            <h1 style={{ color: '#1a237e', marginBottom: '2rem', textAlign: 'center' }}>הזמנות</h1>

            {error && <p>שגיאה בטעינת הנתונים: {error.message}</p>}

            {isLoading ? <Loading /> : (
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <Button
                            label="בטל סינון"
                            icon="pi pi-times"
                            onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                            }}
                            style={{ marginRight: '20px' }}
                        />
                        <Calendar showClear value={endDate} onChange={(e) => setEndDate(e.value)} placeholder="בחר תאריך סיום" showIcon style={{ marginRight: "20px" }} />
                        <Calendar showClear value={startDate} onChange={(e) => setStartDate(e.value)} placeholder="בחר תאריך התחלה" showIcon />

                    </div>
                    <Card style={{ marginLeft:'45px',width: '90%', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <DataTable headerStyle={{ textAlign: 'right' }} value={sortedOrders} responsiveLayout="scroll">
                            <Column  field="status" header="צפה/הכנס סטטוס" body={statusBodyTemplate} />
                            <Column body={viewItemsButtonTemplate} header="מוצרים" />
                            <Column style={{ itemAlign:'center' }} body={communicationButtonTemplate} header="פרטי נציג" />
                            <Column field="totalAmount" header="סכום כולל" body={amountBodyTemplate} />
                            <Column
                                field="date"
                                header="תאריך הזמנה"
                                body={(rowData) => formatDateHebrew(rowData.date)}
                            />
                            <Column field="_id" header="מספר הזמנה" />
                        </DataTable>
                    </Card>
                </div>
            )}

            <ItemsDialog
                visible={isItemsDialogVisible}
                onHide={() => setIsItemsDialogVisible(false)}
                selectedOrder={selectedOrder}
            />

            <Dialog
                header="סטטוס הזמנה"
                visible={isStatusDialogVisible}
                onHide={() => setIsStatusDialogVisible(false)}
            >
                {renderStatusIcons(selectedOrder)}
            </Dialog>

            <Dialog
                header="פרטי נציג שירות"
                headerStyle={{ textAlign: 'center' }}
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setIsDialogVisible(false)}
            >
                {selectedOrder && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>שם נציג שירות: {selectedOrder.supplierId?.representativeName}</p>
                        <p>טלפון נציג שירות: {selectedOrder.supplierId?.phone}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default OrdersPage;