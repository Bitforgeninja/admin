import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Sidebar({ onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "Unknown";
    const [userEmail, setUserEmail] = useState(email);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token on logout
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
            <h1 className="text-3xl font-bold text-center">Dashboard</h1>
            <nav>
                <button
                    onClick={() => onMenuClick('Users')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Users
                </button>
                <button
                    onClick={() => onMenuClick('Markets')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Markets
                </button>
                <button
                    onClick={() => onMenuClick('Add Funds')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Add Funds
                </button>
                <button
                    onClick={() => onMenuClick('Bets')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Bets
                </button>
                <button
                    onClick={() => onMenuClick('Games')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Games
                </button>
                <button
                    onClick={() => onMenuClick('Game Rates')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Game Rates
                </button>
                <button
                    onClick={() => onMenuClick('Platform Settings')}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Platform Settings
                </button>
                {/* Conditionally Render Admins Option */}
                {userEmail === 'pranshu@dpmatka.com' && (
                    <button
                        onClick={() => onMenuClick('Admins')}
                        className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                    >
                        Admins
                    </button>
                )}
                <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                >
                    Logout
                </button>
            </nav>
        </div>
    );
}

export default Sidebar;