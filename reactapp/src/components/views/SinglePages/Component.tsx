import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { server } from "../../../App";
import { getToken } from "../../api/Utils";
import { CenteredLoader } from "../Utils";
import { UserPropInterface } from "../../etc/UserPropInterface";

import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export const ComponentView = ({ user }: UserPropInterface) => {
    const { id } = useParams();

    const [component, setComponent] = useState<any>();
    const [isSaved, setSaved] = useState(false);

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/component/${token}/${id}/load`);
            setComponent(await response.json());
        }
        load();
    }, [id]);

    const handleSave = async () => {
        const token = getToken();
        const response = await fetch(`${server}/content/${token}/post/${id}/${isSaved ? 'unsave' : 'save'}`, {
            method: 'POST'
        });
        setSaved(await response.json());
    }

    return (
        <>
            {component ? (

                <>
                    <div className="post bg-white dark:bg-gray-800 mx-auto mt-16 rounded-lg shadow-lg overflow-hidden max-w-full sm:max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center">
                                <img
                                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-400"
                                    src={component.creator.image}
                                    alt={`${component.creator.userName}'s Profile`}
                                />
                                <div className="ml-4">
                                    <h1 className="text-sm tracking-wider text-gray-700 font-semibold dark:text-gray-200">
                                        <Link to={`/u/${component.creator.userName}`}>{component.creator.userName}</Link>
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(component.created).toDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-content">
                            <div className="px-6 py-4">
                                <img className="rounded-sm shadow-sm object-cover w-full h-64" src={component.image} alt={component.name} />
                                <h1 className="mt-4 text-lg text-gray-800 font-semibold tracking-wide truncate dark:text-gray-200">{component.name}</h1>
                                <p className="mt-2 text-gray-600 text-sm break-words dark:text-gray-200">{component.description}</p>
                            </div>
                        </div>

                        <div className="post-footer flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-700">
                            <button title="Save" className="transition-all hover:bg-gray-400/40 text-white font-bold py-2 px-4 rounded" onClick={handleSave}>
                                {isSaved ? (
                                    <BookmarkIcon className="w-4 h-4" />
                                ) : (
                                    <BookmarkBorderIcon className="w-4 h-4" />
                                )}
                                <span className="sr-only">Save</span>
                            </button>
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