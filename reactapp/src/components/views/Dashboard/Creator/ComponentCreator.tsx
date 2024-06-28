import { ChangeEvent, useEffect, useState } from "react"
import { server } from "../../../../App"
import { getToken } from "../../../api/Utils"
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";
import { CenteredLoader } from "../../Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import AddIcon from '@mui/icons-material/Add';

export const ComponentCreatorView = ({ user }: UserPropInterface) => {
    document.title = "Component Creator";
    
    const [component, setComponent] = useState({ name: '', gender: 'male', componentType: 'Scarf' });
    const [componentTypes, setComponentTypes] = useState<string[]>([]);

    const navigate = useNavigate();
    const options = ['male', 'female', 'both'];

    useEffect(() => {
        const load = async () => {
            const response = await fetch(`${server}/component/types`);
            const data = await response.json();
            setComponentTypes(data);
        };

        load();
    }, [])

    const handleCreate = async () => {
        const token = getToken();
        const response = await fetch(`${server}/component/${token}/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(component),
        });

        const id = await response.json();

        if (!id) {
            return;
        }
        navigate(`/dashboard/components/editor/${id.id}`);
    }

    const handleChange = (e: any) => {
        setComponent({ ...component, [e.target.name]: e.target.value })
    }

    const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setComponent({ ...component, gender: event.target.value });
        if (component.gender === 'male') {
            options.sort();
        }
        else {
            options.sort().reverse();
        }
    };

    const handleComponentChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setComponent({ ...component, componentType: event.target.value });
    };

    return (
        <>
            {user ? (
                <>
                    <div className="container mx-auto px-4 md:px-6 py-8">
                        <div className="flex items-center justify-between mb-6 sm:flex-row flex-col md:justify-center">
                            <div>
                                <select
                                    className="dark:text-white bg-transparent border-transparent outline-none dark:bg-gray-900"
                                    name="gender"
                                    value={component.gender}
                                    onChange={handleGenderChange}
                                >
                                    {options.map((opt, index) => (
                                        <option key={index} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    className="dark:text-white bg-transparent border-transparent outline-noned dark:bg-gray-900"
                                    name="component"
                                    value={component.componentType}
                                    onChange={handleComponentChange}
                                >
                                    {componentTypes && componentTypes.map((component) => (
                                        <option value={component}>{component}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-grow flex justify-center items-center gap-4">
                                <input
                                    className="dark:text-white text-center bg-transparent border-transparent outline-none placeholder-gray-500 dark:placeholder-white"
                                    placeholder="Name"
                                    name="name"
                                    value={component.name}
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