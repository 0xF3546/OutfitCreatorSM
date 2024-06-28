import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CenteredLoader } from "../Utils";
import { server } from "../../../App";
import { formatNumber, getToken } from "../../api/Utils";
import { Avatar } from "@mui/joy";
import { UserPropInterface } from "../../etc/UserPropInterface";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonIcon from '@mui/icons-material/Person';

export const UserView = ({ user }: UserPropInterface) => {
    const { name } = useParams();

    const [isLoading, setLoading] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const [target, setTarget] = useState<any>({});
    const [content, setContent] = useState<any[]>([]);
    const [saved, setSaved] = useState<any[]>([]);
    const [mode, setMode] = useState("posts");
    const [isFollowUIOpened, setFollowUIOpened] = useState(false);
    const [UI, setUI] = useState("");
    const [list, setList] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const token = getToken();
            let response = await fetch(`${server}/profile/${token}/${name}`, {
                method: 'GET',
                mode: 'cors'
            });

            let data = await response.json();

            if (response.ok && data) {
                setTarget(data);
                setIsFollower(data.isUserFollower);
                document.title = `${data.userName}'s Profile`
            }

            response = await fetch(`${server}/content/${token}/${name}`, {
                method: 'GET',
                mode: 'cors'
            });
            data = await response.json();

            if (response.ok && data) {
                setContent(data);
            }

            response = await fetch(`${server}/content/${token}/saved`, {
                method: 'GET',
                mode: 'cors'
            });
            data = await response.json();

            if (response.ok && data) {
                setSaved(data);
            }

            setLoading(false);
        }

        load();
    }, [name]);

    const handleFollow = () => {
        setIsFollower(!isFollower);
        const token = getToken();
        fetch(`${server}/profile/${token}/${name}/${!isFollower ? 'follow' : 'unfollow'}`);
    }

    const handleMessage = () => {
        navigate(`/messages/${name}`);
    }

    const handleEditProfile = () => {
        navigate(`/settings/profile`)
    }

    const handleGotoPost = (id: string) => {
        navigate(`/o/${id}`);
    }

    const toggleMode = () => {
        if (target.userName === user.userName)
            setMode(mode === "posts" ? "edit" : "posts");
    };

    const toggleFollowUI = () => {
        setFollowUIOpened(!isFollowUIOpened);
    }

    const openUI = (ui: string) => {
        toggleFollowUI();
        switch (ui.toLowerCase()) {
            case "follows":
                setUI("follows");
                setList(target.follows);
                break;
            case "follower":
                setUI("follower");
                setList(target.follower);
                break;
        }
    }

    return (
        <>
            {target && !isLoading ? (
                <>
                    {isFollowUIOpened && (
                        <div className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity" onClick={toggleFollowUI}></div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                                <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:my-8 sm:p-6">
                                    <h1 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{UI === 'follows' ? 'Following' : 'Followers'}</h1>
                                    {list && list.map((listUser) => (
                                        <div className="mt-2 flex items-center space-x-3 py-2">
                                            {listUser.image ? (
                                                <img src={listUser.image} className="h-8 w-8 rounded-full" alt={`${listUser.userName}'s Profile`} />
                                            ) : (
                                                <PersonIcon className="dark:text-white"/>
                                            )}
                                            <Link onClick={() => { navigate(`/u/${listUser.userName}`); toggleFollowUI() }} to={`/u/${listUser.userName}`} className="text-blue-500">{listUser.userName}</Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`max-w-2xl mx-auto ${isFollowUIOpened && 'blur'}`}>
                        <div className="px-3 py-2">
                            <div className="flex flex-col gap-1 text-center justify-center items-center">
                                {target.image ? (
                                    <img src={target.image} alt={`${target.userName}'s Profile`} className="block mx-auto bg-center bg-no-repeat bg-cover w-20 h-20 rounded-full border border-gray-400 shadow-lg" />
                                ) : (
                                    <Avatar>
                                        <PersonIcon/>
                                    </Avatar>
                                )}
                                <p className="font-serif font-semibold dark:text-white">{target.userName}</p>
                                <span className="text-sm text-gray-400">{target.bio}</span>
                            </div>

                            <div className="flex justify-center items-center gap-2 my-3">
                                <div className="font-semibold text-center mx-4">
                                    <p className="text-black dark:text-white">{formatNumber(content.length)}</p>
                                    <span className="text-gray-400">Posts</span>
                                </div>
                                <button onClick={() => openUI('follower')} className="font-semibold text-center mx-4">
                                    <p className="text-black dark:text-white">{target.follower ? formatNumber(target.follower.length) : '0'}</p>
                                    <span className="text-gray-400">Followers</span>
                                </button>
                                <button onClick={() => openUI('follows')} className="font-semibold text-center mx-4">
                                    <p className="text-black dark:text-white">{target.follows ? formatNumber(target.follows.length) : '0'}</p>
                                    <span className="text-gray-400">Following</span>
                                </button>
                            </div>

                            <div className="flex justify-center gap-2 my-5">
                                {target.userName !== user.userName ? (
                                    <>
                                        <button onClick={handleFollow} className="bg-blue-800 px-10 py-2 rounded-full text-white shadow-lg">{isFollower ? 'Unfollow' : 'Follow'}</button>
                                        <button onClick={handleMessage} className="bg-white border border-gray-500 px-10 py-2 rounded-full shadow-lg">Message</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleEditProfile} className="bg-blue-800 px-10 py-2 rounded-full text-white shadow-lg">Edit profile</button>
                                        <button onClick={() => navigate('/creator/analytics')} className="bg-blue-800 px-10 py-2 rounded-full text-white shadow-lg">Analytics</button>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <button className={`w-full py-2 dark:text-white ${mode === "posts" && ('border-b-2 border-black dark:border-white')}`} onClick={toggleMode}>
                                    <MenuIcon />
                                </button>
                                <button className={`w-full py-2 dark:text-white ${mode === "edit" && ('border-b-2 border-black dark:border-white')}`} onClick={toggleMode}>
                                    {mode === "edit" ? (
                                        <BookmarkIcon />
                                    ) : (
                                        <BookmarkBorderIcon />
                                    )}
                                </button>
                            </div>
                            {mode === "posts" && (
                                <div className="grid grid-cols-3 gap-2 my-3">
                                    {content && content.map((post, index) => (
                                        <button key={index} className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg relative" onClick={() => handleGotoPost(post.id)} style={{ backgroundImage: `url(${post.outfit.image})` }}>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center bg-black/60 text-white px-2 py-1 rounded-md">
                                                    <ThumbUpIcon />
                                                    <span className="ml-1">{post.likes} Like{post.likes !== 1 && 's'}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {mode === "edit" && (
                                <div className="grid grid-cols-3 gap-2 my-3">
                                {saved && saved.map((post, index) => (
                                    <button key={index} className="block bg-center bg-no-repeat bg-cover h-40 w-full rounded-lg relative" onClick={() => handleGotoPost(post.id)} style={{ backgroundImage: `url(${post.outfit.image})` }}>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center bg-black text-white px-2 py-1 rounded-md">
                                                <ThumbUpIcon />
                                                <span className="ml-1">{post.likes} Like{post.likes !== 1 && 's'}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                        <CenteredLoader />
                    </div >
                </>
            )}
        </>
    );
};
