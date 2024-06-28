import { Avatar, Button, Input } from "@mui/joy";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { formatTime, getToken } from "../../../api/Utils";
import { server } from "../../../../App";
import { CenteredLoader } from "../../Utils";
import { Switch } from "@mui/material";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';

export const User = ({user}: UserPropInterface) => {
    const { id } = useParams();

    const [targetUser, setTargetUser] = useState<any>();
    const [form, setForm] = useState<any>({permission: 0, isAccountDeactivated: false, isAccountVerified: false});

    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Loading... - Users - Admin`;
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/admin/${token}/user/${id}`);
            const usersData = await response.json();

            setTargetUser(usersData);
            document.title = `${usersData.userName} - Users - Admin`;

            setForm({verified: usersData.isAccountVerified, isAccountDeactivated: !usersData.isAccountDeactivated});
        }

        load();
    }, [navigate, id]);

    const handleUpdate = () => {
        var token = getToken();;
        form.isAccountDeactivated = !form.isAccountDeactivated;
        fetch(`${server}/admin/${token}/${targetUser.userName}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(form),
        })
    };

    const handleChange = (e: any) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [event.target.name]: event.target.checked});
    }

    return (
        <>
            {user ? (
                <>
                    {targetUser ? (
                        <>
                            <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-8">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-24 w-24">
                                        <AccountCircleIcon />
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <h1 className="text-2xl font-bold dark:text-gray-200">{targetUser.userName} {targetUser.permission >= 500 && (< HdrAutoIcon color="error" />)}</h1>
                                        <p className="text-gray-500 dark:text-gray-400">{targetUser.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold dark:text-gray-200">Info</h2>
                                    <div className="grid gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400">Account created</p>
                                            <p className="text-gray-500 dark:text-gray-400">{formatTime(targetUser.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400">Last Login</p>
                                            <p className="text-gray-500 dark:text-gray-400">{formatTime(targetUser.lastLogin)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold dark:text-gray-200">Administrative</h2>
                                    <div className="grid gap-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400">Permission</p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                <Input
                                                    name="permission"
                                                    type="number"
                                                    onChange={handleChange}
                                                    value={form.permission}
                                                />
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400">Active</p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                <Switch
                                                    checked={form.isAccountDeactivated}
                                                    onChange={handleSwitchChange}
                                                    name="isAccountDeactivated"
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-500 dark:text-gray-400">Verified</p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                <Switch
                                                    checked={form.isAccountVerified}
                                                    onChange={handleSwitchChange}
                                                    name="isAccountVerified"
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleUpdate}>Update</Button>
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
