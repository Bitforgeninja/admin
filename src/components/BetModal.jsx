import React, { useState } from "react";
import axios from "axios";

function BetModal({ bet, onClose, onSave, onDelete }) {
    const [number, setNumber] = useState(bet.number); // Editable number
    const [status, setStatus] = useState(bet.status); // Editable status
    const [loading, setLoading] = useState(false); // Loading state for save button
    const [deleting, setDeleting] = useState(false); // Loading state for delete button

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
    
            // Log payload and URL for debugging
            console.log("Payload being sent:", {
                marketName: bet.marketName,
                gameName: bet.gameName,
                number, // Updated number
                amount: bet.amount,
                winningRatio: bet.winningRatio,
                status: bet.status, // Include status field
            });
            console.log("API URL:", `https://backend-pbn5.onrender.com/api/admin/bets/${bet._id}`);
    
            const response = await axios.put(
                `https://backend-pbn5.onrender.com/api/admin/bets/${bet._id}`,
                {
                    marketName: bet.marketName,
                    gameName: bet.gameName,
                    number, // Updated number
                    amount: bet.amount,
                    winningRatio: bet.winningRatio,
                    status: bet.status, // Include status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            alert("Bet updated successfully.");
            onSave(response.data); // Refresh the bets list after a successful update
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating bet:", error);
            alert(error.response?.data?.message || "Failed to update the bet.");
        } finally {
            setLoading(false);
        }
    };
       
    

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this bet?")) return;

        setDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://backend-pbn5.onrender.com/api/admin/bets/${bet._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Bet deleted successfully.");
            onDelete(bet._id); // Notify parent component to remove the deleted bet
            onClose(); // Close the modal
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete bet.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Bet</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Number</label>
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="pending">Pending</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleDelete}
                        className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                            deleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                    <div className="flex space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            disabled={loading || deleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BetModal;
