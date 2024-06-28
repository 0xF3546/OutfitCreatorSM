import { useEffect, useState } from "react";
import { getToken } from "../../../api/Utils";
import { server } from "../../../../App";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@mui/joy";
import { CenteredLoader, ConfirmModal } from "../../Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppsIcon from '@mui/icons-material/Apps';


export const ComponentsView = ({ user }: UserPropInterface) => {
    document.title = "Dashboard";

    const [components, setComponents] = useState<Array<any>>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/component/${token}`, {
                mode: "cors"
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setComponents(data);
                } else {
                    console.error("Die Server-Antwort ist kein JSON:", response);
                }
            } else {
                console.error("Anfrage war nicht erfolgreich:", response);
            }
        };

        load();
    }, []);

    const navigate = useNavigate();

    const createNew = () => {
        navigate('create');
    }
    const outfits = () => {
        navigate('/dashboard');
    }

    const filteredComponents = components.filter((component) => (
        component.name.toLowerCase().includes(searchTerm)
    ))

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <>
            {user ? (
                <>
                    <div className="container mx-auto px-4 md:px-6 py-8">
                        <div className="flex items-center justify-between mb-6 sm:flex-row flex-col">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{components.length} Components</h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <form className="flex-1 sm:flex-initial">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <Input
                                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white rounded-lg shadow-md"
                                            id="search"
                                            placeholder="Search components..."
                                            type="search"
                                            startDecorator={< SearchIcon />}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </form>
                                <Button onClick={outfits} className="shrink-0 rounded-lg shadow-md">
                                    <AppsIcon className="w-4 h-4 mr-2" />
                                    Outfits
                                </Button>
                                <Button onClick={createNew} className="shrink-0 rounded-lg shadow-md">
                                    <AddIcon className="w-4 h-4 mr-2" />
                                    Create new
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {components && filteredComponents.map((component) => (
                                <Component
                                    key={component.id}
                                    component={component}
                                    components={components}
                                    setComponents={setComponents}
                                />
                            ))}
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

const Component = ({ component, components, setComponents }: any) => {

    const navigate = useNavigate();

    const [isDeleteModalOpen, showDeleteModal] = useState(false);

    const handleDelete = async () => {
        closeDeleteModal();
        const token = getToken();
        const response = await fetch(`${server}/component/${token}/${component.id}/delete`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            return;
        }
        const updatedComponents = components.filter((o: any) => o.id !== component.id);
        setComponents(updatedComponents);
    }

    const handleEdit = () => {
        navigate(`/dashboard/components/editor/${component.id}`);
    }

    const handleInspect = () => {
        navigate(`/o/${component.id}`);
    }

    const openDeleteModal = () => {
        showDeleteModal(true);
    }

    const closeDeleteModal = () => {
        showDeleteModal(false);
    }

    return (
        <>
            <ConfirmModal
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
            >
                Delete Component?
            </ConfirmModal>
            <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-md shadow-md w-full max-w-md mx-auto">
                <p className="dark:text-white">{component.name}</p>
                <div className="mt-4">
                    <img
                        alt={`Component ${component.name}`}
                        className="aspect-square object-cover rounded-md"
                        height={400}
                        src={component.image}
                        width={400}
                    />
                    <p className="mt-2 text-sm dark:text-white">{component.description}</p>
                </div>
                <div className="mt-4 flex justify-end items-end space-x-4">
                    <button onClick={handleInspect} className="transition-all hover:bg-blue-700 text-black dark:text-white font-bold py-2 px-4 rounded">
                        <VisibilityIcon className="w-4 h-4" />
                        <span className="sr-only">Inspect</span>
                    </button>
                    <button onClick={handleEdit} className="transition-all hover:bg-blue-400 text-black dark:text-white font-bold py-2 px-4 rounded">
                        <ModeEditIcon className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                    </button>
                    <button onClick={openDeleteModal} className="transition-all hover:bg-red-700 text-black dark:text-white font-bold py-2 px-4 rounded">
                        <DeleteIcon className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                    </button>
                </div>
            </div>
        </>
    );
}