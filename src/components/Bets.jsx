import React, { useEffect, useState } from "react";
import axios from "axios";
import BetModal from "./BetModal";

function Bets() {
    const [betsData, setBetsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedBet, setSelectedBet] = useState(null); // Track selected bet for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

    useEffect(() => {
        fetchBets();
    }, []);

    const fetchBets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication error: No token found");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "https://only-backend-je4j.onrender.com/api/admin/bets",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setBetsData(response.data.bets || []);
        } catch (err) {
            setError("Failed to fetch bets. " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEditBet = async (response) => {
        console.log("Received response for update:", response);
        const updatedBet = response.bet;
    
        if (!updatedBet || !updatedBet._id) {
            console.error("No ID found or incorrect bet data:", updatedBet);
            alert("Error: No bet ID provided or incorrect bet data.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://only-backend-je4j.onrender.com/api/admin/bets/${updatedBet._id}`,
                updatedBet,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Update successful for bet ID:", updatedBet._id);
            fetchBets();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update bet:", error);
            alert("Failed to update bet. Please try again.");
        }
    };
    
    

    const handleDeleteBet = async (betId) => {
        if (!window.confirm("Are you sure you want to delete this bet?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://only-backend-je4j.onrender.com/api/admin/bets/${betId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Bet deleted successfully.");
            fetchBets(); // Refresh bets list after deletion
        } catch (error) {
            alert("Failed to delete bet. Please try again.");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBet(null);
        fetchBets(); // Refresh the bets list on modal close
    };

    if (loading) return <p>Loading bets...</p>;
    if (error) return <p>{error}</p>;

    const activeBets = betsData.filter((bet) => bet.status.toLowerCase() === "pending");
    const completedBets = betsData.filter((bet) => bet.status.toLowerCase() !== "pending");

    return (
        <div
            className="h-[calc(100vh-4rem)] p-4 bg-white rounded-lg shadow space-y-4 overflow-hidden"
        >
            {/* Active Bets Section */}
            <div className="h-1/2 bg-gray-50 rounded-lg shadow-md p-4 overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Bets</h2>
                {activeBets.length === 0 ? (
                    <p className="text-gray-500">No active bets available.</p>
                ) : (
                    <div className="overflow-auto h-full">
                        <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Market
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Game
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activeBets.map((bet) => (
                                    <tr key={bet._id} className="hover:bg-gray-50 transition duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {bet.user ? bet.user.name : "No User"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bet.marketName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bet.gameName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            ${bet.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {bet.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedBet(bet);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBet(bet._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            {/* <i className="fas fa-trash"></i> */}
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Completed Bets Section */}
            <div className="h-1/2 bg-gray-50 rounded-lg shadow-md p-4 overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Completed Bets</h2>
                {completedBets.length === 0 ? (
                    <p className="text-gray-500">No completed bets available.</p>
                ) : (
                    <div className="overflow-auto h-full">
                        <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Market
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Game
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Winning Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedBets.map((bet) => {
                                    const winningAmount =
                                        bet.status.toLowerCase() === "won" ? bet.amount * bet.winningRatio : 0;

                                    return (
                                        <tr key={bet._id} className="hover:bg-gray-50 transition duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {bet.user ? bet.user.name : "No User"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {bet.marketName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {bet.gameName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                ${bet.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {winningAmount > 0 ? `$${winningAmount.toFixed(2)}` : "-"}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                                bet.status.toLowerCase() === "won"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}>
                                                {bet.status}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bet Modal */}
            {isModalOpen && selectedBet && (
                <BetModal
                    bet={selectedBet}
                    onClose={handleModalClose}
                    onSave={handleEditBet}
                />
            )}
        </div>
    );
}

export default Bets;
