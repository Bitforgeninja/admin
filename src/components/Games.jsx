import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Games = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState('');
  const [inputOne, setInputOne] = useState('');
  const [inputTwo, setInputTwo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('https://only-backend-je4j.onrender.com/api/markets');
        setMarkets(response.data);
        setSelectedMarketId(response.data[0]?.marketId);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError('Failed to load markets');
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const handleMarketChange = (event) => {
    setSelectedMarketId(event.target.value);
  };

  const handleInputOneChange = (event) => {
    setInputOne(event.target.value);
  };

  const handleInputTwoChange = (event) => {
    setInputTwo(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://only-backend-je4j.onrender.com/api/admin/markets/declare-results',
        {
          marketId: selectedMarket.marketId,
          openResult: inputOne,
          closeResult: inputTwo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Submit success:', response.data);
      window.alert('✅ Game results updated successfully!'); // Success alert
      
    } catch (err) {
      console.error('Error submitting:', err);
      window.alert('❌ Failed to update game results. Please try again!'); // Error alert
    }
  };

  const selectedMarket = markets.find((market) => market.marketId === selectedMarketId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-xl font-bold mb-4">Games Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="market-select" className="block text-gray-700 text-sm font-bold mb-2">
          Select Market:
        </label>
        <select
          id="market-select"
          value={selectedMarketId}
          onChange={handleMarketChange}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {markets.map((market) => (
            <option key={market.marketId} value={market.marketId}>
              {market.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-4 items-center">
          <div>
            <label htmlFor="inputOne" className="block text-gray-700 text-sm font-bold mb-2">
              Input One:
            </label>
            <input
              id="inputOne"
              type="text"
              value={inputOne}
              onChange={handleInputOneChange}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter first value"
            />
          </div>
          <div>
            <label htmlFor="inputTwo" className="block text-gray-700 text-sm font-bold mb-2">
              Input Two:
            </label>
            <input
              id="inputTwo"
              type="text"
              value={inputTwo}
              onChange={handleInputTwoChange}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter second value"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>

      {selectedMarket && (
        <div>
          <h2 className="text-lg font-bold">Market Details:</h2>
          <p><strong>Market ID:</strong> {selectedMarket.marketId}</p>
          <p><strong>Name:</strong> {selectedMarket.name}</p>
          <p><strong>Open Time:</strong> {selectedMarket.openTime}</p>
          <p><strong>Close Time:</strong> {selectedMarket.closeTime}</p>
          <p><strong>Betting Status:</strong> {selectedMarket.isBettingOpen ? 'Open' : 'Closed'}</p>
          <h3 className="text-lg font-bold mt-2">Results:</h3>
          <ul>
            {selectedMarket.results &&
              Object.entries(selectedMarket.results).map(([key, value]) => (
                <li key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Games;
