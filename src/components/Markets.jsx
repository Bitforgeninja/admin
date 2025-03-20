import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketFormModal from './MarketFormModal';
import ActiveMarketsTable from './ActiveMarketsTable';
import './ToggleSwitch.css';

function Markets() {
    const [marketsData, setMarketsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMarkets();
    }, []);

    const fetchMarkets = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.get('https://only-backend-je4j.onrender.com/api/markets', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMarketsData(
                response.data.map((market) => ({
                    ...market,
                    id: market._id,
                    type: market.marketId,
                    results: {
                        openNumber: market.results?.openNumber || '---',
                        closeNumber: market.results?.closeNumber || '---',
                        openSingleDigit: market.results?.openSingleDigit || '---',
                        closeSingleDigit: market.results?.closeSingleDigit || '---',
                        jodiResult: market.results?.jodiResult || '---',
                    }
                }))
            );
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch markets');
            setLoading(false);
        }
    };

    const handleToggleSwitch = async (marketId, currentState) => {
        console.log("Toggle request for market ID:", marketId);
        try {
            const token = localStorage.getItem('token');
            const marketToUpdate = marketsData.find((market) => market.marketId === marketId);
            if (!marketToUpdate) {
                console.error("Market with ID not found:", marketId);
                setError("Market not found.");
                return;
            }
    
            console.log("Updating market:", marketToUpdate);
            await axios.put(
                `https://only-backend-je4j.onrender.com/api/admin/markets/${marketId}`,
                {
                    isBettingOpen: !currentState // ✅ Only send isBettingOpen (openBetting updates automatically)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // ✅ Update state immediately to reflect changes
            setMarketsData((prevMarkets) =>
                prevMarkets.map((market) =>
                    market.marketId === marketId
                        ? { ...market, isBettingOpen: !currentState, openBetting: !currentState }
                        : market
                )
            );
        } catch (error) {
            console.error("Failed to toggle market:", error);
            setError("Failed to toggle market: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAddMarket = async (newMarket) => {
        setLoadingAdd(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'https://only-backend-je4j.onrender.com/api/admin/add-market',
                newMarket,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchMarkets(); // Refresh markets list after a new addition
            setShowModal(false);
        } catch (error) {
            setError('Failed to add market: ' + error.message);
        }
        setLoadingAdd(false);
    };

    const handleDeleteMarket = async (marketId) => {
        if (!window.confirm("Are you sure you want to delete this market?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `https://only-backend-je4j.onrender.com/api/admin/markets/${marketId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMarketsData((prevMarkets) =>
                prevMarkets.filter((market) => market.id !== marketId)
            );

            alert("Market deleted successfully.");
        } catch (error) {
            setError("Failed to delete market: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <p>Loading markets...</p>;
    if (error) return <p>Error loading markets: {error}</p>;

    return (
        <div
            className="p-8 bg-white rounded-lg shadow relative overflow-hidden"
            style={{ height: 'calc(100vh - 4rem)' }}
        >
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Markets</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className={`bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded shadow ${
                            loadingAdd ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={loadingAdd}
                    >
                        {loadingAdd ? 'Adding...' : 'Add Market'}
                    </button>
                </div>
                <div style={{ maxHeight: 'calc(100vh - 10rem)', overflowY: 'auto' }}>
                    <ActiveMarketsTable
                        marketsData={marketsData}
                        handleToggleBetting={handleToggleSwitch}
                        handleDeleteMarket={handleDeleteMarket}
                    />
                </div>
            </div>

            {showModal && (
                <MarketFormModal
                    onClose={() => setShowModal(false)}
                    onSave={handleAddMarket}
                />
            )}
        </div>
    );
}

export default Markets;
