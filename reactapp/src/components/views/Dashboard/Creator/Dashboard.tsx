import { Route, Routes, useNavigate } from "react-router-dom"
import { CreatorView } from "./Creator"
import { useEffect, useState } from "react"
import { CenteredLoader, ConfirmModal } from "../../Utils";
import { Button, Input } from "@mui/joy";
import { server } from "../../../../App";
import { getToken } from "../../../api/Utils";
import { Editor } from "./Editor";
import { ComponentsView } from "./Components";
import { ComponentCreatorView } from "./ComponentCreator";
import { ComponentEditor } from "./ComponentEditor";

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AppsIcon from '@mui/icons-material/Apps';
import UploadIcon from '@mui/icons-material/Upload';

export const Dashboard = ({ user, postCreator }: any) => {
    return (
        <>
            <Routes>
                <Route path="/" element={< DashboardView user={user} postCreator={postCreator} />} />
                <Route path="components" element={< ComponentsView user={user} />} />
                <Route path="components/create" element={<ComponentCreatorView user={user} />} />
                <Route path="components/editor/:id" element={<ComponentEditor user={user} />} />
                <Route path="create" element={< CreatorView user={user} />} />
                <Route path="editor/:id" element={<Editor user={user} />} />
            </Routes>
        </>
    )
}

const DashboardView = ({ user, postCreator }: any) => {
    document.title = "Dashboard";

    const [outfits, setOutfits] = useState<Array<any>>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/outfit/${token}/load`, {
                mode: "cors"
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setOutfits(data);
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

    const components = () => {
        navigate('components');
    }

    const filteredOutfits = outfits.filter((outfit) => (
        outfit.name.toLowerCase().includes(searchTerm)
    ))

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <>
            {user ? (
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="flex items-center justify-between mb-6 sm:flex-row flex-col">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{filteredOutfits.length} Outfits</h1>
                        <div className="flex items-center gap-4 flex-wrap">
                            <form className="flex-1 sm:flex-initial">
                                <div className="relative">
                                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <Input
                                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] rounded-lg shadow-md"
                                        id="search"
                                        placeholder="Search outfits..."
                                        type="search"
                                        startDecorator={< SearchIcon />}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </form>
                            <Button onClick={components} className="shrink-0 rounded-lg shadow-md">
                                <AppsIcon className="w-4 h-4 mr-2" />
                                Components
                            </Button>
                            <Button onClick={createNew} className="shrink-0 rounded-lg shadow-md">
                                <AddIcon className="w-4 h-4 mr-2" />
                                Create new
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {outfits && filteredOutfits.map((outfit, index) => (
                            <Outfit
                                key={outfit.id}
                                outfit={outfit}
                                outfits={outfits}
                                setOutfits={setOutfits}
                                postCreator={postCreator}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                    <CenteredLoader />
                </div>
            )}
        </>
    )
}

const Outfit = ({ outfit, outfits, setOutfits, postCreator }: any) => {
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const [isPrivate, setPrivate] = useState(false);

    const [isDeleteModalOpen, showDeleteModal] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const token = getToken();
        try {
            const response = await fetch(
                `${server}/creator/${token}/${outfit.id}/delete`,
                { method: 'DELETE' }
            );
            if (response.ok) {
                const updatedOutfits = outfits.filter((o: any) => o.id !== outfit.id);
                setOutfits(updatedOutfits);
                setLoading(false);
            } else {
                setLoading(false);
                throw new Error('Delete request failed');
            }

        } catch (error) {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigate(`/dashboard/editor/${outfit.id}`);
    }

    const handleChangePrivacy = async () => {
        const token = getToken();
        const response = await fetch(`${server}/content/${token}/post/${outfit.id}/toggleprivacy`, {
            method: 'POST'
        });
        if (response.ok) {
            setPrivate(await response.json());
        }
    }

    const handleUpload = () => {
        postCreator(outfit);
    }

    const openDeleteModal = () => {
        showDeleteModal(true);
    }

    const closeDeleteModal = () => {
        showDeleteModal(false);
    }

    return (
        <>
            {!isLoading ? (
                <>
                    <ConfirmModal
                        open={isDeleteModalOpen}
                        onClose={closeDeleteModal}
                        onConfirm={handleDelete}
                    >
                        Delete Outfit?
                    </ConfirmModal>
                    <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-md shadow-md w-full max-w-md mx-auto">
                        <p className="dark:text-white">{outfit.name}</p>
                        <div className="mt-4">
                            <img
                                alt={`Post ${outfit.name} ${outfit.description && ('| ' + outfit.description)}`}
                                className="aspect-square object-cover rounded-md"
                                height={400}
                                src={outfit.image}
                                width={400}
                            />
                            <p className="mt-2 text-sm dark:text-white">{outfit.description}</p>
                        </div>
                        <div className="mt-4 flex justify-end items-end space-x-4">
                            {!outfit.isUploaded && (
                                <button title="Upload" onClick={handleUpload} className="transition-all hover:bg-blue-700 text-black dark:text-white font-bold py-2 px-4 rounded">
                                    <UploadIcon className="w-4 h-4" />
                                    <span className="sr-only">Upload</span>
                                </button>
                            )}
                            {outfit.isUploaded && (
                                <button title="Change Visibillity" onClick={handleChangePrivacy} className="transition-all hover:bg-blue-700 text-black dark:text-white font-bold py-2 px-4 rounded">
                                    {!isPrivate ? (
                                        <VisibilityOffIcon className="w-4 h-4" />
                                    ) : (
                                        <VisibilityIcon className="w-4 h-4" />
                                    )}
                                    <span className="sr-only">Inspect</span>
                                </button>
                            )}
                            <button title="Edit" onClick={handleEdit} className="transition-all hover:bg-blue-400 text-black dark:text-white font-bold py-2 px-4 rounded">
                                <ModeEditIcon className="w-4 h-4" />
                                <span className="sr-only">Edit</span>
                            </button>
                            <button title="Delete" onClick={openDeleteModal} className="transition-all hover:bg-red-700 text-black dark:text-white font-bold py-2 px-4 rounded">
                                <DeleteIcon className="w-4 h-4" />
                                <span className="sr-only">Delete</span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                    <CenteredLoader />
                </div>
            )}
        </>
    );
}