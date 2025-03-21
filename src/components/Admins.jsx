import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('https://backend-pbn5.onrender.com/api/admin/admins');

            setAdmins(response.data.admins); // Assuming the response has an `admins` array
        } catch (err) {
            setError('Failed to fetch admins. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading admins...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
            {admins.length === 0 ? (
                <p>No admins found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin._id}>
                                <td className="border border-gray-300 px-4 py-2">{admin.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{admin.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{admin.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Admins;
