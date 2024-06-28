import { useNavigate } from "react-router-dom";
import { CenteredLoader, PageHeaderWithBackrouting } from "../../Utils";
import { useEffect, useState } from "react";
import { getToken } from "../../../api/Utils";
import { server } from "../../../../App";
import { UserPropInterface } from "../../../etc/UserPropInterface";

export const EditProfileView = ({ user }: UserPropInterface) => {
    document.title = "Profile - Settings"
    
    const [form, setForm] = useState({ userName: '', profilePictureFile: '', image: '', public: false });
    const [inputType, setInputType] = useState('fileInput');
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setForm({ ...form, userName: user.userName, image: user.imagePath, public: user.isAccountPublic });
    }, [])

    const handleChange = (e: any) => {
        const value = e.target.name === 'profilePictureFile' ? e.target.files[0] : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    }

    const handleTabClick = (type: string) => {
        setInputType(type);
    }

    const handleSave = async () => {
        setLoading(true);
        const token = getToken();
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]: any) => formData.append(key, val));
        const response = await fetch(`${server}/profile/${token}/update`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            setLoading(false);
        } else {
            navigate('/');
        }
    }

    return (
        <>
            <PageHeaderWithBackrouting
                routing={'/settings'}
            > Profile
            </PageHeaderWithBackrouting>
            <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <CenteredLoader />
                    </div>
                )}
                <div className={`relative py-3 sm:max-w-xl sm:mx-auto ${isLoading && 'blur'}`}>
                    <div className="relative px-4 py-10 bg-gray-100 dark:bg-gray-800 mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                        <div className="max-w-md mx-auto">
                            <div className="flex items-center space-x-5">
                                <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                                    <h2 className="leading-relaxed dark:text-white">Profile Settings</h2>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 dark:text-gray-200 sm:text-lg sm:leading-7">
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Username</label>
                                        <input disabled={isLoading} value={form.userName} type="text" name="userName" id="username" onChange={handleChange} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500" placeholder={user.userName} autoComplete="off" required />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Profile Picture</label>
                                        <div className="flex">
                                            <div className={`py-2 -mb-px mr-8 cursor-pointer ${inputType === "fileInput" && 'text-blue-400 dark:text-blue-600'}`} onClick={() => handleTabClick('fileInput')}>Image</div>
                                            <div className={`py-2 -mb-px mr-8 cursor-pointer ${inputType === "linkInput" && 'text-blue-400 dark:text-blue-600'}`} onClick={() => handleTabClick('linkInput')}>Link</div>
                                        </div>
                                        {inputType === 'fileInput' &&
                                            <input
                                                disabled={isLoading}
                                                value={form.profilePictureFile} type="file"
                                                name="profilePictureFile"
                                                id="profilepicfile"
                                                onChange={handleChange}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500"
                                                required
                                            />
                                        }
                                        {inputType === 'linkInput' &&
                                            <input
                                                disabled={isLoading}
                                                value={form.image}
                                                type="text"
                                                id="profilepiclink"
                                                name="image"
                                                onChange={handleChange}
                                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500"
                                                placeholder="https://..."
                                                required
                                            />
                                        }
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="leading-loose">Visibility</label>
                                        <select disabled={isLoading} name="public" id="visibility" onChange={handleChange} className="px-2 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500" required>
                                            {form.public ? (
                                                <>
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="private">Private</option>
                                                    <option value="public">Public</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center space-x-4">
                                    <button disabled={isLoading} onClick={handleSave} className="flex justify-center items-center w-full text-blue-500 p-3 rounded-md bg-blue-100 dark:bg-blue-700/90 dark:text-white">
                                        <span className="ml-1">Apply changes</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
