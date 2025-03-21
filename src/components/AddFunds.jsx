import React, { useState, useEffect } from "react";
import axios from "axios";

function AddFunds() {
    const [fundRequests, setFundRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFundRequests = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication error: No token found");
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(
                    "https://backend-pbn5.onrender.com/api/admin/transactions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFundRequests(response.data.transactions || []);
                setLoading(false);
            } catch (err) {
                setError(`Error fetching fund requests: ${err.message}`);
                setLoading(false);
            }
        };

        fetchFundRequests();
    }, []);

    const handleTransaction = async (transaction, status) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "https://backend-pbn5.onrender.com/api/wallet/verify",
                { transactionId: transaction.transactionId, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setFundRequests(
                fundRequests.map((request) =>
                    request._id === transaction._id ? { ...request, status } : request
                )
            );

            alert(`Transaction ${status} successfully.`);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to process the transaction. Please try again."
            );
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const renderTable = (transactions, type) => (
        <div className="bg-white p-4 shadow rounded overflow-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{type} Transactions</h3>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Receipt</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{transaction.user?.name || "N/A"}</td>
                            <td className="px-6 py-4">{transaction.user?.email || "N/A"}</td>
                            <td className="px-6 py-4">${transaction.amount}</td>
                            <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{transaction.type}</td>
                            <td className={`px-6 py-4 font-semibold ${
                                transaction.status === "approved"
                                    ? "text-green-500"
                                    : transaction.status === "rejected"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                            }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </td>
                            <td className="px-6 py-4">
                                {transaction.receiptUrl ? (
                                    <a href={transaction.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        View Receipt
                                    </a>
                                ) : "No Receipt"}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {transaction.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleTransaction(transaction, "approved")}
                                            className="text-green-500 hover:text-green-600 text-lg mr-4"
                                            disabled={transaction.processingRequest}
                                        >
                                            ✔
                                        </button>
                                        <button
                                            onClick={() => handleTransaction(transaction, "rejected")}
                                            className="text-red-500 hover:text-red-600 text-lg"
                                            disabled={transaction.processingRequest}
                                        >
                                            ✘
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const deposits = fundRequests.filter(t => t.type === "deposit");
    const withdrawals = fundRequests.filter(t => t.type === "withdrawal");

    return (
        <div className="flex flex-col gap-6 p-6">
            {renderTable(deposits, "Deposit")}
            {renderTable(withdrawals, "Withdrawal")}
        </div>
    );
}

export default AddFunds;
