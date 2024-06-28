import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { CenteredLoader, PageHeaderWithBackrouting } from "../../Utils";
import { server } from "../../../../App";
import { getToken } from "../../../api/Utils";
import { UserPropInterface } from "../../../etc/UserPropInterface";

import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LinkIcon from '@mui/icons-material/Link';

export const ComponentEditor = ({ user }: UserPropInterface) => {
    document.title = "Component Editor"
    const { id } = useParams();
    
    const [props, setProps] = useState({ name: '', gender: '', image: '', componentType: '', id: '', color: '' });
    const [componentTypes, setComponentTypes] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            let response = await fetch(`${server}/component/${token}/${id}/load`);
            let data = await response.json();
            if (data.image === "null") {
                data.image = "";
            }
            setProps(data);

            response = await fetch(`${server}/component/types`);
            data = await response.json();
            setComponentTypes(data);
        };

        load();

    }, [id])

    const handleChange = (e: any) => {
        setProps({ ...props, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        const token = getToken()
        let formData = new FormData();
        formData.append('name', props.name)
        formData.append('gender', props.gender)
        formData.append('componentType', props.componentType);
        formData.append('color', props.color);

        if (profileImage) {
            formData.append('formFile', profileImage)
        } else {
            formData.append('image', props.image);
        }
        await fetch(`${server}/component/${token}/${id}/update`, {
            method: 'POST',
            body: formData,
        })
    }


    const handleGenderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setProps({ ...props, gender: event.target.value });
    };

    const handleComponentChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        setProps({ ...props, componentType: e.target.value });
    };

    const [profileImage, setProfileImage] = useState<string | null>(null);


    const handleImageChange = (e: any) => {
        setProfileImage(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <>
            {user && props ? (
                <>
                    <PageHeaderWithBackrouting
                        routing={'/dashboard/components'}
                    >
                        Component-Editor
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
                                    <option value="both">Both</option>
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

                        <div className="w-full sm:w-auto mb-6">
                            <label htmlFor="profileImgFile" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Image
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
                                    className="text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border-transparent outline-none rounded-lg p-2 dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500 pl-10" // Hier wurde die Klasse pl-10 hinzugefügt
                                    placeholder="Enter Image URL"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-white">
                                    <LinkIcon />
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-start space-x-4 mt-3 sm:mt-0">
                            <div className="flex-auto sm:flex-initial mb-4 sm:mb-0">
                                <label className="text-gray-800 dark:text-gray-200 block mb-1">Type:</label>
                                <select value={props.componentType} className="w-full h-10 py-2 px-3 border border-gray-300 bg-white dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleComponentChange}>
                                    <option value={""}>Please choose an option</option>
                                    {componentTypes && componentTypes.map((component: any, index: number) => (
                                        <option key={index} value={component}>{component}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-auto sm:flex-initial">
                                <label className="text-gray-800 dark:text-gray-200 block mb-1">Color:</label>
                                <input
                                    name="color"
                                    onChange={handleChange}
                                    value={props.color}
                                    className="w-full h-10 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border-transparent rounded-lg p-2 dark:border-gray-600 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    type="color"
                                />
                            </div>
                        </div>

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