import React, { useEffect, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice';
import useAuth from '../../hooks/useAuth';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../NavBar.css';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();
    const profileMenu = useRef(null);
    const navigate = useNavigate();
    const [logout, { isSuccess }] = useSendLogoutMutation();
    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    useEffect(() => {
        if (isSuccess) navigate("/");
    }, [isSuccess, navigate]);

    const items = [
        {
            label: 'הוספת מוצרים',
            command: () => navigate("/addgoods"),
            template: (item, options) => (
                <a
                    className={`p-menuitem-link ${location.pathname === '/addgoods' ? 'active-nav-item' : ''}`}
                    onClick={options.onClick}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                    {item.label}
                </a>
            )
        },
        {
            label: 'צפייה בהזמנות',
            command: () => navigate("/orderss"),
            template: (item, options) => (
                <a
                    className={`p-menuitem-link ${location.pathname === '/orderss' ? 'active-nav-item' : ''}`}
                    onClick={options.onClick}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                    {item.label}
                </a>
            )
        },
    ];

    const { name, profil } = useAuth();

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

export default NavBar;
