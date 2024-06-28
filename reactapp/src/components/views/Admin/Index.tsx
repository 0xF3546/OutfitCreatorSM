import { Link, Route, Routes } from "react-router-dom"
import { Users } from "./Users/Users"
import { User } from "./Users/User"
import { Requests } from "./etc/Requests"
import { Roles } from "./etc/Roles"
import { Reports } from "./etc/Reports"
import { UserPropInterface } from "../../etc/UserPropInterface"

export const AdminView = ({ user }: UserPropInterface) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<View user={user} />} />
                <Route path='users' element={<Users user={user} />} />
                <Route path="users/:id" element={<User user={user} />} />
                <Route path="requests" element={<Requests user={user} />} />
                <Route path="reports" element={<Reports user={user} />} />
                <Route path="roles" element={<Roles user={user}/>} />
            </Routes>
        </>
    )
}

const View = ({ user }: UserPropInterface) => {
    document.title = "Admin";
    
    return (
        <div className="min-h-screen flex flex-col justify-center font-sans dark:text-white">
            <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
                <div className="py-8">
                    <h2 className="text-4xl font-semibold leading-tight mb-8 text-center">Admin Dashboard</h2>
                    <div className="grid gap-10">
                        <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold leading-tight mb-2">Overview</h3>
                            <div className="grid gap-4 grid-cols-2">
                                <div className="text-gray-700 dark:text-gray-300">
                                    Total Users: <span className="font-bold">0</span>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    Website Traffic: <span className="font-bold">2500</span>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    Pending Requests: <span className="font-bold">12</span>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">
                                    Open Tasks: <span className="font-bold">4</span>
                                </div>
                            </div>
                            <div className="flex my-6">
                                <Link
                                    to="users" 
                                    className="px-5 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-700 focus:outline-none"
                                >
                                    View Users
                                </Link>
                                <Link
                                    to="requests" 
                                    className="px-5 py-2 ml-4 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-700 focus:outline-none"
                                >
                                    Manage Requests
                                </Link>
                            </div>
                        </div>
                        
                        <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold leading-tight mb-2">Content Management</h3>
                            <div className="flex my-6">
                                <Link
                                    to="posts" 
                                    className="px-5 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-700 focus:outline-none"
                                >
                                    View Posts
                                </Link>
                                <Link
                                    to="reports" 
                                    className="px-5 py-2 ml-4 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-700 focus:outline-none"
                                >
                                    Manage Reports
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold leading-tight mb-2">User Rights Management</h3>
                            <div className="flex my-6">
                                <Link
                                    to="roles" 
                                    className="px-5 py-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-700 focus:outline-none"
                                >
                                    Manage Roles
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}