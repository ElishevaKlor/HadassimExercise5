import React, { useEffect, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice';
import useAuth from '../../hooks/useAuth';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../NavBar.css'; 

const NavBarStoreManager = () => {
    const profileMenu = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [logout, { isSuccess }] = useSendLogoutMutation();
    const { name } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);

    const menuItems = [
        { label: 'צפייה בהזמנות', path: '/ordersm' },
        { label: 'ביצוע הזמנה', path: '/invatation' },
        { label: 'רישום מוצר בקופה', path: '/cash-register' },
        { label: 'קופה', path: '/checkoutScreen' }
    ];

    const items = menuItems.map(item => ({
        label: item.label,
        command: () => navigate(item.path),
        template: (itemData, options) => {
            const isActive = location.pathname === item.path;
            return (
                <a
                    className={`p-menuitem-link ${isActive ? 'active-nav-item' : ''}`}
                    onClick={options.onClick}
                >
                    <span className="p-menuitem-text">{item.label}</span>
                </a>
            );
        }
    }));

    const end = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                שלום {name}
            </span>
            <Avatar
                icon="pi pi-user"
                shape="circle"
                style={{ cursor: 'pointer' }}
                onClick={(e) => profileMenu.current.toggle(e)}
            />
            <OverlayPanel ref={profileMenu} dismissable>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Button label="Log Out" onClick={handleLogout} icon="pi pi-sign-out" className="p-button-text" />
                </div>
            </OverlayPanel>
        </div>
    );

    return <Menubar model={items} end={end} className="custom-menubar" />;
};

export default NavBarStoreManager;
