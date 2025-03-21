import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GameRates() {
    const [rates, setRates] = useState([]);
    const [updating, setUpdating] = useState(false); // Track updating state

    useEffect(() => {
        const fetchRates = async () => {
            console.log(localStorage.getItem('token'));
            try {
                const response = await axios.get('https://backend-pbn5.onrender.com/api/admin/winning-ratios', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const { winningRatios } = response.data;
                if (winningRatios) {
                    setRates(winningRatios.map(rate => ({
                        id: rate._id,
                        gameName: rate.gameName,
                        ratio: rate.ratio
                    })));
                }
            } catch (error) {
                console.error('Error fetching rates:', error);
            }
        };

        fetchRates();
    }, []);

    const handleInputChange = (index, value) => {
        const updatedRates = [...rates];
        updatedRates[index].ratio = value;
        setRates(updatedRates);
    };

    const updateRate = async (id, ratio) => {
        setUpdating(true); // Start updating
        try {
            await axios.put(`https://backend-pbn5.onrender.com/api/admin/winning-ratios/${id}`, { ratio }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Update successful:', id);
        } catch (error) {
            console.error('Error updating rate:', error);
        } finally {
            setUpdating(false); // End updating
        }
    };

    return (
        <div className="p-8 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-4">Game Rates</h2>
            <form>
                {rates.map((rate, index) => (
                    <div className="flex items-center mb-4" key={rate.id}>
                        <label htmlFor={rate.id} className="block mb-2 flex-1">{rate.gameName}</label>
                        <input
                            type="text"
                            id={rate.id}
                            value={rate.ratio}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            className="border border-gray-300 p-2 rounded mr-2 flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => updateRate(rate.id, rate.ratio)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded relative"
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : '✓'}
                        </button>
                    </div>
                ))}
            </form>
        </div>
    );
}

export default GameRates;
