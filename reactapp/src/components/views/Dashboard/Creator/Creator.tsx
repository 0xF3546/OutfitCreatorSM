import { ChangeEvent, useState } from "react"
import { server } from "../../../../App"
import { getToken } from "../../../api/Utils"
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";
import { CenteredLoader } from "../../Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import AddIcon from '@mui/icons-material/Add';

export const CreatorView = ({ user }: UserPropInterface) => {
    document.title = "Outfit Creator";

    const [outfit, setOutfit] = useState({ name: '', gender: '' });

    const navigate = useNavigate();

    const handleCreate = async () => {
        const token = getToken();
        const response = await fetch(`${server}/creator/${token}/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(outfit),
        });

        const id = await response.json();

        if (!id) {
            return;
        }
        navigate(`/dashboard/editor/${id.id}`);
    }

    const handleChange = (e: any) => {
        setOutfit({ ...outfit, [e.target.name]: e.target.value })
    }

    const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOutfit({ ...outfit, gender: event.target.value });
    };

    return (
        <>
            {user ? (
                <>
                    <div className="container mx-auto px-4 md:px-6 py-8">
                        <div className="flex items-center justify-between mb-6 sm:flex-row flex-col md:justify-center">
                            <div>
                                {outfit.gender === 'male' ? (
                                    <select
                                        className="text-gray-900 dark:text-white dark:bg-gray-800 bg-transparent border-transparent outline-none rounded-lg p-2 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                        name="gender"
                                        value={outfit.gender}
                                        onChange={handleGenderChange}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                ) : (
                                    <select
                                        className="text-gray-900 dark:text-white dark:bg-gray-800 bg-transparent border-transparent outline-none rounded-lg p-2 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                        name="gender"
                                        value={outfit.gender}
                                        onChange={handleGenderChange}
                                    >
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                    </select>
                                )}
                            </div>
                            <div className="flex-grow flex justify-center items-center gap-4">
                                <input
                                    className="dark:text-white text-center bg-transparent border-transparent outline-none placeholder-gray-500 dark:placeholder-white"
                                    placeholder="Name"
                                    name="name"
                                    value={outfit.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex justify-end items-center">
                                <Button onClick={handleCreate} className="shrink-0 rounded-lg shadow-md">
                                    <AddIcon className="w-4 h-4 mr-2" />
                                    Create and Edit
                                </Button>
                            </div>
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