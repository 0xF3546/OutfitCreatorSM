import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { CenteredLoader, PageHeaderWithBackrouting } from "../../Utils";
import { server } from "../../../../App";
import { getToken } from "../../../api/Utils";
import { AnimatePresence, motion } from "framer-motion";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LinkIcon from '@mui/icons-material/Link';

const ComponentsModal = ({ onClose, componentTypes, props, setProps, handleSuggestionSearch }: any) => {
    const [selectedComponent, setSelectedComponent] = useState("");
    const [clothing, setClothing] = useState<any>();
    const [clothes, setClothes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClothingImage, setSelectedClothingImage] = useState<string | null>(null);

    const handleComponentChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedComponent(e.target.value);
        setIsLoading(true);

        const token = getToken();
        try {
            const response = await fetch(`${server}/component/${token}/${e.target.value}/${props.gender}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setClothes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const add = () => {
        onClose();
        var isEqual = false;
        props.components.forEach((prop: any) => {
            if (prop.id === clothing.id) isEqual = true;
        });
        if (isEqual) return;
        const newProps = [...(props.components || [])];
        newProps.push(clothing);
        setProps({ ...props, components: newProps });
        handleSuggestionSearch(newProps, props);
    }

    const handleClothingChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedClothing = clothes.find(c => c.name === e.target.value);
        setClothing(selectedClothing || "");
        setSelectedClothingImage(selectedClothing?.image || null);
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900 dark:text-white">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Select Component:</h3>
                                <select className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleComponentChange}>
                                    <option value="">Please choose an option</option>
                                    {componentTypes && componentTypes.map((component: any, index: number) => (
                                        <option key={index} value={component}>{component}</option>
                                    ))}
                                </select>
                                {isLoading && <p>Loading...</p>}
                                {selectedComponent && (
                                    <>
                                        <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Select Clothing:</h3>
                                        <select className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleClothingChange}>
                                            <option value="">Please choose an option</option>
                                            {clothes && clothes.map((clothing: any, index: number) => (
                                                <option key={index} value={clothing.name}>{clothing.name}</option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                        {selectedClothingImage && (
                            <div className="mt-4">
                                <img src={selectedClothingImage} alt={clothing} className="mx-auto max-w-full h-auto" />
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                            Close
                        </button>
                        <button onClick={add} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Editor = ({ user }: UserPropInterface) => {
    document.title = "Outfit Editor"
    const { id } = useParams();

    const [props, setProps] = useState({ name: '', gender: '', components: [], image: '' });
    const [componentTypes, setComponentTypes] = useState<any[]>([]);
    const [suggestion, setSuggestion] = useState<any>();
    const [isClothesModalShown, setClothesModalShown] = useState(false);

    const handleSuggestionSearch = async (properties: any, props: any) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('gender', props.gender);
        console.log(props.gender);
        properties.forEach((component: any, index: number) => {
            formData.append(`components[${index}].Id`, component.id);
        });
        const response = await fetch(`${server}/creator/${token}/suggestion`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        setSuggestion(data);
        console.log(data);
    }

    const handleAddSuggestion = () => {
        if (!suggestion) return;
        const newProps: any = [...(props.components || [])];
        newProps.push(suggestion);
        setProps({ ...props, components: newProps });
        setSuggestion(null);
    }

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            let response = await fetch(`${server}/outfit/${token}/${id}/load`);
            let data = await response.json();

            if (data.image === "null") data.image = "";

            setProps(data);

            response = await fetch(`${server}/component/types`);
            data = await response.json();
            setComponentTypes(data);
        };

        load();
    }, [id]);

    const handleChange = (e: any) => {
        setProps({ ...props, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        const token = getToken()
        const formData = new FormData();
        formData.append('name', props.name);
        formData.append('gender', props.gender);
        formData.append('image', props.image);

        props.components.forEach((component: any, index) => {
            formData.append(`components[${index}].Id`, component.id);
        });

        if (props.image) {
            formData.append('image', props.image);
        } else {
            if (profileImage) {
                formData.append('formFile', profileImage)
            }
        }
        await fetch(`${server}/creator/${token}/${id}/update`, {
            method: 'POST',
            body: formData,
        })
    }

    const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setProps({ ...props, gender: event.target.value });
    };

    const [profileImage, setProfileImage] = useState<string | null>(null);


    const handleImageChange = (e: any) => {
        setProfileImage(e.target.files[0]);
    };

    const openClothesModal = () => {
        setClothesModalShown(true);
    }

    const closeClothesModal = () => {
        setClothesModalShown(false);
    }

    return (
        <>
            {user && props ? (
                <>
                    {isClothesModalShown && (
                        <ComponentsModal
                            onClose={closeClothesModal}
                            props={props}
                            setProps={setProps}
                            componentTypes={componentTypes}
                            handleSuggestionSearch={handleSuggestionSearch}
                        />
                    )}
                    <PageHeaderWithBackrouting
                        routing={'/dashboard'}
                    >
                        Editor
                    </PageHeaderWithBackrouting>
                    <br />
                    <div className="container mx-auto px-4 lg:px-6 py-8 rounded-lg bg-white dark:bg-gray-800">
                        <div className="flex lg:flex-row flex-col items-center justify-between mb-6">
                            <div className="mb-4 lg:mb-0">
                                <select
                                    className="text-gray-900 dark:text-white dark:bg-gray-800 bg-transparent border-transparent outline-none rounded-lg p-2 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    name="gender"
                                    value={props.gender}
                                    onChange={handleGenderChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="flex-grow flex justify-center items-center gap-4 mb-4 lg:mb-0">
                                <input
                                    className="text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border-transparent outline-none rounded-lg p-2 placeholder-gray-500 dark:placeholder-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    placeholder="Name"
                                    name="name"
                                    value={props.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex justify-end items-center">
                                <button onClick={handleUpdate} className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md">
                                    <ChangeCircleIcon className="w-4 h-4 mr-2" />
                                    Update
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center flex-col">
                            {props.image && (
                                <img src={props.image} alt="profile" className="mt-4 rounded-lg shadow-md" />
                            )}
                        </div>

                        <AnimatePresence>
                            {props.components && props.components.map((component: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Component
                                        component={component}
                                        props={props}
                                        setProps={setProps}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className="w-full sm:w-auto mb-6">
                            <label htmlFor="profileImgFile" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Profile image
                            </label>
                            <input type="file" id="profileImgFile" name="profileImgFile" className="hidden" onChange={handleImageChange} />
                            <label htmlFor="profileImgFile" className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md mb-2 inline-block">
                                Choose File
                            </label>
                            <div className="relative">
                                <input
                                    name="image"
                                    value={props.image}
                                    type="text"
                                    onChange={handleChange}
                                    className="text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border-transparent outline-none rounded-lg p-2 dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 pl-10"
                                    placeholder="Enter Image URL"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-white">
                                    <LinkIcon />
                                </span>
                            </div>
                        </div>

                        <button onClick={openClothesModal} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md mt-4">
                            Select Components
                        </button>
                        {suggestion && (
                            <div>
                                <p className="font-medium text-gray-700 dark:text-white mt-4">Suggestion: {suggestion.name}</p>
                                <button onClick={handleAddSuggestion} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md mt-4">
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                    <CenteredLoader />
                </div>
            )}
        </>
    )
}

const Component = ({ component, props, setProps }: any) => {

    const remove = () => {
        const newComponents = props.components.filter((p: any) => p.id !== component.id);
        setProps({ ...props, components: newComponents });
    }

    return (
        <div className="max-w-sm mx-auto bg-gray-100 rounded-xl shadow-md overflow-hidden md:max-w-md m-2 dark:bg-gray-900">
            <div className="md:flex">
                <div className="md:flex-shrink-0 p-3">
                    <img className="w-full h-full object-cover rounded-lg md:h-48 md:w-48 transform hover:scale-110 transition-all duration-500 ease-in-out" src={component.image} alt={component.name} />
                </div>
                <div className="p-6">
                    <div className="text-md tracking-wide text-gray-600 dark:text-gray-300 md:text-lg">{component.name}</div>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 hover:scale-105 transition-all" onClick={remove}>Remove</button>
                </div>
            </div>
        </div>
    )
}
