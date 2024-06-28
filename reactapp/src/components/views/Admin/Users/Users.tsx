import { Avatar, Button, Input } from "@mui/joy";
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { server } from "../../../../App";
import { CenteredLoader } from "../../Utils";
import { getToken } from "../../../api/Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';

const AddUserModal = ({ onClose, onSave }: any) => {
    const [form, setForm] = useState({ email: '', username: '' });

    const save = () => {
        onSave(form);
        setForm({ email: '', username: '' });
    }

    const handleInputChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800">
                <div className="flex justify-end space-x-2">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 relative">

                        <button className="absolute right-3 top-3 text-gray-700 hover:text-gray-900 dark:text-white z-10" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className={`p-6 space-y-4 md:space-y-6 sm:p-8`}>
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create user
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input
                                        onChange={handleInputChange}
                                        type="text"
                                        value={form.email}
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input
                                        onChange={handleInputChange}
                                        type="text"
                                        value={form.username}
                                        name="username"
                                        id="password"
                                        placeholder="Username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button onClick={save} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const Users = ({ user }: UserPropInterface) => {
    document.title = "Users - Admin"

    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${server}/admin/${token}/users`);
            const usersData = await response.json();

            setUsers(usersData);
            setLoading(false);
        }

        load();
    }, [navigate]);

    const filteredUsers = users.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAddUserModal = () => {
        setAddUserModalOpen(true);
    }

    const closeAddUserModal = () => {
        setAddUserModalOpen(false);
    }

    const addNewUser = (form: any) => {
        var user = getToken();;
        fetch(`${server}/account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: user ? user : '',
            },
            mode: 'cors',
            body: JSON.stringify(form),
        }).finally(() => reloadUsers());
        setAddUserModalOpen(false);
    };

    const reloadUsers = async () => {
        setLoading(true);
        var userIdentityToken = getToken();;
        const response = await fetch(`${server}/account/users/get`, {
            method: 'GET',
            headers: {
                Authorization: userIdentityToken ? userIdentityToken : '',
            },
            mode: 'cors',
        })
            .finally(() => setLoading(false));
        const usersData = await response.json();

        setUsers(usersData);
    }


    return (
        <>
            {user ? (
                <>
                    {isAddUserModalOpen && (
                        <AddUserModal
                            onClose={closeAddUserModal}
                            onSave={addNewUser}
                        />
                    )}
                    <div className="container mx-auto px-4 md:px-6 py-8">
                        <div className="flex items-center justify-between mb-6 sm:flex-row flex-col">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{filteredUsers.length} User</h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <form className="flex-1 sm:flex-initial">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <Input
                                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white rounded-lg shadow-md"
                                            id="search"
                                            placeholder="Search users..."
                                            type="search"
                                            startDecorator={< SearchIcon />}
                                            onChange={(event) => {
                                                setSearchTerm(event.target.value);
                                            }}
                                        />
                                    </div>
                                </form>
                                <Button className="shrink-0 rounded-lg shadow-md">
                                    <ArrowUpDownIcon className="w-4 h-4 mr-2" />
                                    Sort by
                                </Button>
                                <Button onClick={openAddUserModal} className="shrink-0 rounded-lg shadow-md">
                                    <AddIcon className="w-4 h-4 mr-2" />
                                    Create new
                                </Button>

                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {!isLoading && !isAddUserModalOpen ? filteredUsers.map((user) => (
                                <>
                                    <Link to={`${user.userName}`} className="flex gap-4 items-start rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 transform hover:scale-105 transition-transform">
                                        <Avatar className="w-14 h-14 border">
                                            <AccountCircleIcon />
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <h3 className="font-semibold dark:text-gray-200">{user.userName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Beschreibung</p>
                                        </div>
                                    </Link>
                                </>
                            )) : (
                                <>
                                    {!isAddUserModalOpen && (
                                        <CenteredLoader />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                        <CenteredLoader />
                    </div>
                </>
            )}
        </>
    )
}

function ArrowUpDownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
        </svg>
    )
}


function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
