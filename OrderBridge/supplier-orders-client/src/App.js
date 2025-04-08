import logo from './logo.svg';
import './App.css';
import Login from './features/auth/login/Login';
import SignUp from './features/users/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PersistLogin from './features/auth/PersistLogin';
import HomePage from './Components/HomePage';
import OrdersPage from './Components/StoreManager/OrdersPage';
import OrderFromSupplierPage from './Components/StoreManager/OrdersFromSupplierPage';
import AddGoods from './Components/Supplier/AddGoodsPage';
import OrdersPageSupplier from './Components/Supplier/OrdersPageSupplier';
import RequireAuth from './features/auth/RequireAuth';
import CashRegister from './Components/StoreManager/cashRegister';
import CheckOutScreen from './Components/StoreManager/checkOutScreen';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={['storeManager']} />}>
              <Route path="/ordersm" element={<OrdersPage />} />
              <Route path="/invatation" element={<OrderFromSupplierPage />} />
              <Route path="/cash-register" element={<CashRegister/>}/>
              <Route path="/checkoutScreen" element={<CheckOutScreen/>}/>
            </Route>

            <Route element={<RequireAuth allowedRoles={['supplier']} />}>
              <Route path="/orderss" element={<OrdersPageSupplier />} />
              <Route path="/addgoods" element={<AddGoods />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
