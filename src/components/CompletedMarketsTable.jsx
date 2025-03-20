import React from 'react';

function CompletedMarketsTable({ marketsData }) {
    return (
        <div>
            <table className="min-w-full bg-white divide-y divide-gray-200 shadow-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {marketsData.map((market) => (
                        <tr key={market.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">{market.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.openTime}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.closeTime}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.type}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{market.result || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompletedMarketsTable;
