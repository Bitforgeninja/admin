import React, { useState } from "react";
import axios from "axios";

function UserModal({ user, onClose, onSave, onDelete, isNewUser }) {
    const [editedUser, setEditedUser] = useState(
        isNewUser
            ? { name: "", email: "", password: "", phoneNumber: "", walletBalance: 0 }
            : { ...user }
    );
    

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({
            ...editedUser,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
    
            if (isNewUser) {
                // 🔥 Validate all required fields only for adding a new user
                if (!editedUser.name || !editedUser.email || !editedUser.password || !editedUser.phoneNumber) {
                    alert("⚠️ All fields are required to add a new user!");
                    setLoading(false);
                    return;
                }
    
                // Create New User
                const response = await axios.post(
                    "https://backend-pbn5.onrender.com/api/admin/users/add",
                    {
                        name: editedUser.name,
                        email: editedUser.email,
                        password: editedUser.password, // ✅ Required only when adding user
                        phoneNumber: editedUser.phoneNumber,
                        walletBalance: editedUser.walletBalance,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                alert("✅ User added successfully!");
                console.log("✅ API Response:", response.data);
                // onSave(response.data.user);
            } else {
                // 🔥 Only send non-empty fields when updating a user
                const updateData = {};
                if (editedUser.name) updateData.name = editedUser.name;
                if (editedUser.phoneNumber) updateData.phoneNumber = editedUser.phoneNumber;
                if (editedUser.email) updateData.email = editedUser.email;
                if (editedUser.walletBalance !== undefined) updateData.walletBalance = editedUser.walletBalance;
    
                await axios.put(
                    `https://backend-pbn5.onrender.com/api/admin/users/${user._id}`,
                    updateData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                alert("✅ User updated successfully!");
                onSave(editedUser);
            }
        } catch (error) {
            console.error("❌ Error saving user:", error.response ? error.response.data : error.message);
            alert(`❌ Failed to save user. ${error.response?.data?.message || "Please try again."}`);
        } finally {
            setLoading(false);
            if (isNewUser) {
                setEditedUser({ name: "", email: "", password: "", phoneNumber: "", walletBalance: 0 }); // Reset only for new user
            }
            setTimeout(() => onClose(), 500); // ✅ Ensures modal closes smoothly without triggering an error alert
        }
    };
    
    

    const handleDelete = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://backend-pbn5.onrender.com/api/admin/users/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("✅ User deleted successfully!");
            onDelete(user._id);
            onClose();
        } catch (error) {
            console.error("❌ Error deleting user:", error);
            alert("❌ Failed to delete user.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {isNewUser ? "Add New User" : "Edit User Details"}
                </h2>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editedUser.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={editedUser.phoneNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        {!user?._id && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editedUser.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Wallet Balance</label>
                            <input
                                type="number"
                                name="walletBalance"
                                value={editedUser.walletBalance}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        {!isNewUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                <p className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center space-x-4 mt-6">
                        {!isNewUser && (
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                disabled={loading}
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                disabled={loading}
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
                </form>
            </div>
        </div>
    );
}

export default UserModal;
