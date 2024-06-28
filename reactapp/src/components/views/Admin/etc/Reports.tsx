import { Link } from "react-router-dom";
import { UserPropInterface } from "../../../etc/UserPropInterface";

export const Reports = ({user}: UserPropInterface) => {
    document.title = "Reports - Admin";
    
    const requests = [
        { id: 1, type: 'Comment', text: 'Hello', account: 'Test' },
        { id: 2, type: 'Chat-Message', text: 'Gong', account: 'Pascal' },
        { id: 3, type: 'Post', text: 'sgug-234fg-dhdh3', account: 'Pascal' },
        // ... add more requests as needed
    ];

    return (
        <div className="min-h-screen text-gray-900 dark:text-white flex justify-center py-6 px-4">
            <div className="w-full mx-auto">
                <div className="text-2xl font-bold text-center mb-6">Manage Reports</div>
                <div className="bg-white dark:bg-gray-700 rounded shadow-md overflow-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-left">Report ID</th>
                                <th className="px-4 py-2 font-semibold text-left">Type</th>
                                <th className="px-4 py-2 font-semibold text-left">Text</th>
                                <th className="px-4 py-2 font-semibold text-left">Account</th>
                                <th className="px-4 py-2 font-semibold text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {requests.map((request, i) => (
                                <tr key={request.id} className={i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-600' : ''}>
                                    <td className="px-4 py-2 text-centered">{request.id}</td>
                                    <td className="px-4 py-2">{request.type}</td>
                                    <td className="px-4 py-2">{request.text}</td>
                                    <td className="px-4 py-2"><Link to={`/u/${request.account}`}>{request.account}</Link></td>
                                    <td className="px-4 py-2">
                                        <button className="px-3 py-1 mx-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded">
                                            Punish
                                        </button>
                                        <button className="px-3 py-1 mx-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}