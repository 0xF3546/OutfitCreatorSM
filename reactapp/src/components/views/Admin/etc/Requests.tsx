import { UserPropInterface } from "../../../etc/UserPropInterface";

export const Requests = ({user}: UserPropInterface) => {
    document.title = "Requests - Admin";
    
    const requests = [
        { id: 1, name: 'Request 1', status: 'Pending' },
        { id: 2, name: 'Request 2', status: 'Pending' },
        // ... add more requests as needed
    ];

    return (
        <div className="min-h-screen text-gray-900 dark:text-white flex justify-center py-6 px-4">
            <div className="w-full mx-auto">
                <div className="text-2xl font-bold text-center mb-6">Manage Requests</div>
                <div className="bg-white dark:bg-gray-700 rounded shadow-md overflow-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-600">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-left">Request ID</th>
                                <th className="px-4 py-2 font-semibold text-left">Name</th>
                                <th className="px-4 py-2 font-semibold text-left">Status</th>
                                <th className="px-4 py-2 font-semibold text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {requests.map((request, i) => (
                                <tr key={request.id} className={i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-600' : ''}>
                                    <td className="px-4 py-2 text-centered">{request.id}</td>
                                    <td className="px-4 py-2">{request.name}</td>
                                    <td className="px-4 py-2">{request.status}</td>
                                    <td className="px-4 py-2">
                                        <button className="px-3 py-1 mx-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded">
                                            Approve
                                        </button>
                                        <button className="px-3 py-1 mx-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded">
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