import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Users from './Users';
import Markets from './Markets';
import AddFunds from './AddFunds';
import Bets from './Bets';
import Games from './Games';
import GameRates from './GameRates'; // Import the GameRates component
import Admins from './Admins';
import PlatformSettings from './PlatformSettings';
import { useLocation } from 'react-router-dom';

function Dashboard() {
    const [content, setContent] = useState('Users'); // Default content
    const location = useLocation();
    const email = location.state?.email || "Unknown"; // Handling email from route state

    const handleMenuClick = (menu) => {
        setContent(menu);
    };

    const renderContent = () => {
        switch (content) {
            case 'Users':
                return <Users />;
            case 'Markets':
                return <Markets />;
            case 'Add Funds':
                return <AddFunds />;
            case 'Bets':
                return <Bets />;
            case 'Games':
                return <Games />;
            case 'Game Rates':
                return <GameRates />;
            case 'Platform Settings':
                return <PlatformSettings />;
            case 'Admins':
                return <Admins />;
            default:
                return <Users />; // Default to Users if the case is not matched
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar onMenuClick={handleMenuClick} />
            <div className="flex-1 p-10 overflow-auto"> {/* Ensuring content area is scrollable */}
                {renderContent()}
            </div>
        </div>
    );
}

export default Dashboard;
