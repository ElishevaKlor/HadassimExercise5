const OrderStatusEnum = {
    WAITING: { key: 'waiting', label: 'הזמנה התקבלה' },
    IN_PROCESS: { key: 'in process', label: 'בהכנה אצל הספק' },
    COMPLETED: { key: 'completed', label: 'נמסר למוכר' }
};

Object.freeze(OrderStatusEnum); 

module.exports = OrderStatusEnum;