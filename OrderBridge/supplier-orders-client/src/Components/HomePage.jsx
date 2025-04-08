import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate('/signup'); 
    };

    const handleLogin = () => {
        navigate('/login'); 
    };

    return (
        <div style={{ backgroundColor: '#e3f2fd', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ width: '400px', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h1 style={{ color: '#1a237e', marginBottom: '2rem', textAlign: 'center' }}>ברוכים הבאים למערכת ניהול הזמנות</h1>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button label="הרשמה" onClick={handleSignup} style={{ backgroundColor: '#1976d2', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }} />
                    <Button label="התחברות" onClick={handleLogin} style={{ backgroundColor: '#1976d2', color: 'white', padding: '1rem 2rem', fontSize: '1rem' }} />
                </div>
            </Card>
        </div>
    );
};

export default HomePage;