import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlatformSettings() {
    const [settings, setSettings] = useState({
        upiId: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        adminAddress: '',
        qrCodeUrl: '',
        bannerImageUrl: '',
        whatsAppNumber: ''  // New field for managing WhatsApp number
    });
    const [qrImage, setQrImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('https://backend-pbn5.onrender.com/api/admin/platform-settings', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token') // Assuming the token is stored in localStorage
                    }
                });
                const { adminContact, upiId, bannerImageUrl, qrCodeUrl, whatsAppNumber } = response.data;
                setSettings({
                    upiId: upiId || '',
                    adminName: adminContact?.name || '',
                    adminEmail: adminContact?.email || '',
                    adminPhone: adminContact?.phone || '',
                    adminAddress: adminContact?.address || '',
                    qrCodeUrl: qrCodeUrl || '',
                    bannerImageUrl: bannerImageUrl || '',
                    whatsAppNumber: whatsAppNumber || '' // Ensure this field is actually being returned by the backend
                });
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };
    
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e, type) => {
        if (type === 'qrCode') {
            setQrImage(e.target.files[0]);
        } else if (type === 'banner') {
            setBannerImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('upiId', settings.upiId);
        formData.append('adminContact[name]', settings.adminName);
        formData.append('adminContact[email]', settings.adminEmail);
        formData.append('adminContact[phone]', settings.adminPhone);
        formData.append('adminContact[address]', settings.adminAddress);
        formData.append('whatsAppNumber', settings.whatsAppNumber); // Append WhatsApp number to the formData
        if (qrImage) formData.append('qrCode', qrImage);
        if (bannerImage) formData.append('bannerImage', bannerImage);

        try {
            const response = await axios.put('https://backend-pbn5.onrender.com/api/admin/platform-settings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            alert('Settings updated successfully!');
            console.log(response.data); // Log or handle the response data as needed
        } catch (error) {
            console.error('Error updating settings', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-lg font-bold mb-4">Platform Settings</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-md font-bold mb-2">Current Settings</h3>
                    <ul>
                    <li><strong>UPI ID:</strong> {settings.upiId}</li>
                        <li><strong>Admin Name:</strong> {settings.adminName}</li>
                        <li><strong>Admin Email:</strong> {settings.adminEmail}</li>
                        <li><strong>Admin Phone:</strong> {settings.adminPhone}</li>
                        <li><strong>Admin Address:</strong> {settings.adminAddress}</li>
                        <li><strong>WhatsApp Number:</strong> {settings.whatsAppNumber}</li>
                        <li><strong>QR Code:</strong> <img src={settings.qrCodeUrl} alt="QR Code" style={{ width: '100px', height: '100px' }} /></li>
                        <li><strong>Banner Image:</strong> <img src={settings.bannerImageUrl} alt="Banner" style={{ width: '300px', height: '100px' }} /></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-md font-bold mb-2">Edit Settings</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="upiId" className="block mb-2">UPI ID:</label>
                            <input type="text" id="upiId" name="upiId" value={settings.upiId} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adminName" className="block mb-2">Admin Contact Name:</label>
                            <input type="text" id="adminName" name="adminName" value={settings.adminName} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adminEmail" className="block mb-2">Admin Contact Email:</label>
                            <input type="email" id="adminEmail" name="adminEmail" value={settings.adminEmail} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adminPhone" className="block mb-2">Admin Contact Phone:</label>
                            <input type="tel" id="adminPhone" name="adminPhone" value={settings.adminPhone} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adminAddress" className="block mb-2">Admin Contact Address:</label>
                            <input type of="text" id="adminAddress" name="adminAddress" value={settings.adminAddress} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="qrCode" className="block mb-2">Upload New QR Code:</label>
                            <input type="file" id="qrCode" onChange={(e) => handleImageChange(e, 'qrCode')} className="p-2 border rounded"></input>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bannerImage" className="block mb-2">Upload New Banner Image:</label>
                            <input type="file" id="bannerImage" onChange={(e) => handleImageChange(e, 'banner')} className="p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="whatsAppNumber" className="block mb-2">WhatsApp Number:</label>
                            <input type="text" id="whatsAppNumber" name="whatsAppNumber" value={settings.whatsAppNumber} onChange={handleChange} className="p-2 border rounded" />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PlatformSettings;