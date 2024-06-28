import { useEffect, useState } from "react"
import { UserPropInterface } from "../../../etc/UserPropInterface"
import { server } from "../../../../App";
import { getToken } from "../../../api/Utils";
import { CenteredLoader } from "../../Utils";

const AdvertiseModal = ({ onClose, post }: any) => {

    const [amount, setAmount] = useState(0);

    const handleChange = (e: any) => {
        const newValue = e.target.value;
        if (newValue < 0) {
            setAmount(0);
            return;
        }

        setAmount(newValue);
    }

    const buy = () => {

    }

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-gray-600">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900 dark:text-white">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Advertise post #{post.id}</h3>
                                </div>
                            </div>
                            <h3 className="mt-4 text-lg leading-6 font-medium text-gray-200">Amount:</h3>
                            <input type="number" value={amount} onChange={handleChange} className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 dark:text-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                                Close
                            </button>
                            <button onClick={buy} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const Advertise = ({ user }: UserPropInterface) => {
    const [content, setContent] = useState<any[]>([]);
    const [isAdvertiseModalOpen, setAdvertiseModalOpen] = useState(false);
    const [advertisePost, setAdvertisePost] = useState();

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/content/${token}/${user.userName}`, {
                method: 'GET',
                mode: 'cors'
            });

            const data = await response.json();
            setContent(data);
        }

        load();
    }, [user]);

    const closeAdvertiseModal = () => {
        setAdvertiseModalOpen(false);
    }

    const openAdvertiseModal = (post: any) => {
        setAdvertisePost(post);
        setAdvertiseModalOpen(true);
    }

    return (
        <>
            {content ? (
                <>
                    {isAdvertiseModalOpen && (
                        <AdvertiseModal
                            onClose={closeAdvertiseModal}
                            post={advertisePost}
                        />
                    )}

                    <div className="grid grid-cols-3 gap-2 my-3">
                        <>
                            {content.map((c, i) => (
                                <>
                                    <button key={i} onClick={() => openAdvertiseModal(c)} className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg relative" style={{ backgroundImage: `url(${c.outfit.image})` }}>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center bg-black/60 text-white px-2 py-1 rounded-md">
                                                <span className="ml-1">Click to Advertise</span>
                                            </div>
                                        </div>
                                    </button>
                                </>
                            ))}
                        </>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center h-screen">
                        <CenteredLoader />
                    </div>
                </>
            )}
        </>
    )
}