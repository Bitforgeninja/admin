// ✅ Updated Markets.jsx with Edit Support
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarketFormModal from './MarketFormModal';
import ActiveMarketsTable from './ActiveMarketsTable';
import './ToggleSwitch.css';

function Markets() {
    const [marketsData, setMarketsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMarket, setEditingMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMarkets();
    }, []);

    const fetchMarkets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://backend-pbn5.onrender.com/api/markets', {
                headers: { Authorization: `Bearer ${token}` },
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
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://backend-pbn5.onrender.com/api/admin/markets/${marketId}`,
                { isBettingOpen: !currentState },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setMarketsData((prevMarkets) =>
                prevMarkets.map((market) =>
                    market.marketId === marketId
                        ? { ...market, isBettingOpen: !currentState, openBetting: !currentState }
                        : market
                )
            );
        } catch (error) {
            setError("Failed to toggle market: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAddMarket = async (newMarket) => {
        setLoadingAdd(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'https://backend-pbn5.onrender.com/api/admin/add-market',
                newMarket,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchMarkets();
            setShowModal(false);
        } catch (error) {
            setError('Failed to add market: ' + error.message);
        }
        setLoadingAdd(false);
    };

    const handleEditMarket = (market) => {
        setEditingMarket(market);
        setShowModal(true);
    };

    const handleSaveMarket = async (market) => {
        setLoadingAdd(true);
        try {
            const token = localStorage.getItem('token');
            if (editingMarket) {
                await axios.put(
                    `https://backend-pbn5.onrender.com/api/markets/edit/${editingMarket.marketId}`,
                    {
                        ...market,
                        openBetting: market.isBettingOpen
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    'https://backend-pbn5.onrender.com/api/admin/add-market',
                    market,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            fetchMarkets();
            setShowModal(false);
            setEditingMarket(null);
        } catch (error) {
            setError('Failed to save market: ' + error.message);
        }
        setLoadingAdd(false);
    };

    const handleDeleteMarket = async (marketId) => {
        if (!window.confirm("Are you sure you want to delete this market?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `https://backend-pbn5.onrender.com/api/admin/markets/${marketId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMarketsData((prevMarkets) =>
                prevMarkets.filter((market) => market.marketId !== marketId)
            );

            alert("Market deleted successfully.");
        } catch (error) {
            setError("Failed to delete market: " + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <p>Loading markets...</p>;
    if (error) return <p>Error loading markets: {error}</p>;

    return (
        <div className="p-8 bg-white rounded-lg shadow relative overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Markets</h2>
                    <button
                        onClick={() => {
                            setEditingMarket(null);
                            setShowModal(true);
                        }}
                        className={`bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded shadow ${loadingAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loadingAdd}
                    >
                        {loadingAdd ? 'Saving...' : 'Add Market'}
                    </button>
                </div>
                <div style={{ maxHeight: 'calc(100vh - 10rem)', overflowY: 'auto' }}>
                    <ActiveMarketsTable
                        marketsData={marketsData}
                        handleToggleBetting={handleToggleSwitch}
                        handleDeleteMarket={handleDeleteMarket}
                        handleEditMarket={handleEditMarket}
                    />
                </div>
            </div>

            {showModal && (
                <MarketFormModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingMarket(null);
                    }}
                    onSave={handleSaveMarket}
                    existingMarket={editingMarket}
                />
            )}
        </div>
    );
}

export default Markets;
