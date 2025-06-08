import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router-dom';

const TempUser = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
            {/* Header */}
            <Header />

            <Outlet />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default TempUser;
