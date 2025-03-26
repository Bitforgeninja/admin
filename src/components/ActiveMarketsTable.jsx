// ✅ Updated ActiveMarketsTable with Edit Button
import React from 'react';

function ActiveMarketsTable({ marketsData, handleToggleBetting, handleDeleteMarket, handleEditMarket }) {
    return (
        <div>
            <table className="min-w-full bg-white divide-y divide-gray-200 shadow-sm mb-6">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Market Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Open Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Close Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Market ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Betting
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {marketsData.map((market) => (
                        <tr key={market.marketId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">{market.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.openTime}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.closeTime}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.marketId}</td>
                            <td className="px-4 py-3 text-sm">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={market.isBettingOpen}
                                        onChange={() => handleToggleBetting(market.marketId, market.isBettingOpen)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                                <button
                                    onClick={() => handleEditMarket(market)}
                                    className="text-blue-500 hover:text-blue-700 text-base p-1"
                                    title="Edit"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => handleDeleteMarket(market.marketId)}
                                    className="text-red-500 hover:text-red-700 text-base p-1"
                                    title="Delete"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ActiveMarketsTable;
