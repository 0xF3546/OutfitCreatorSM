import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { formatChatTime, formatTime, getToken, getUserData, isUserValid } from "../../api/Utils";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/joy";
import { useMediaQuery } from "@mui/material";
import { CenteredLoader, CommentSection, PageHeader, ShareUI } from "../Utils";
import { server } from "../../../App";
import { useTranslation } from "react-i18next";
import { UserModel } from "../../etc/UserModel";
import { PostView } from "../SinglePages/Post";
import { MessagesView } from "../Messages/Messages";
import { UserView } from "../SinglePages/User";
import { Dashboard } from "./Creator/Dashboard";
import { SettingsView } from "../Account/Settings/Settings";
import { CreatorView } from "../Account/Creator/CreatorsView";
import { Explore } from "../Explore/Explore";
import { AdminView } from "../Admin/Index";
import { ComponentView } from "../SinglePages/Component";
import { UserPropInterface } from "../../etc/UserPropInterface";

import WavingHandIcon from '@mui/icons-material/WavingHand';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MessageIcon from '@mui/icons-material/Message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import Close from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';

const PostCreator = ({ onSave, onClose, outfit }: any) => {
    const [form, setForm] = useState({ description: '', outfitId: '' });

    useEffect(() => {
        if (outfit === null) {
            return;
        }
        setForm({ ...form, outfitId: outfit.id });
    }, [form, outfit])

    const uploadPost = () => {
        onSave(form);
    }

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 modal-overlay">
            <div className="relative mx-auto py-3 sm:max-w-xl">
                <div className="relative px-4 bg-gray-100 dark:bg-gray-800 shadow rounded-3xl sm:px-10 sm:py-10">
                    <div className="max-w-md">
                        <button onClick={onClose} className="absolute top-3 right-3 dark:text-white focus:outline-none">
                            <Close className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-5">
                            <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                                <h2 className="leading-relaxed dark:text-white">Create Post</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 dark:text-gray-200 sm:text-lg sm:leading-7">
                                <div className="flex flex-col">
                                    <label className="leading-loose">Name</label>
                                    <input disabled value={outfit.name} type="text" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500" required />
                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Description</label>
                                    <input value={form.description} type="text" name="description" id="description" onChange={handleChange} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Outfit</label>
                                    <input disabled value={form.outfitId} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-0 placeholder-gray-500" required />
                                </div>
                                <div className="pt-4 flex items-center space-x-4">
                                    <button onClick={uploadPost} className="flex justify-center items-center w-full text-blue-500 p-3 rounded-md bg-blue-100 dark:bg-blue-700/90 dark:text-white">
                                        <span className="ml-1">Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export const DashboardView = () => {
    const { t } = useTranslation();

    const [userData, setUserData] = useState<UserModel>(new UserModel());
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [postOpened, setPostOpened] = useState(false);
    const [postOutfit, setPostOutfit] = useState<string>();
    const [searchValues, setSearchValues] = useState<any[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        const load = async () => {
            var ud = await getUserData();
            setUserData(ud);
            if (!isUserValid(ud)) {
                navigate('/login');
                return;
            }
        }

        load();
    }, [navigate]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isDesktopOrLaptop = useMediaQuery(
        '(min-device-width: 768px)'
    );

    const toggleSearch = () => {
        setSearchOpen(!isSearchOpen);
    }

    const search = async () => {
        if (!searchQuery) {
            return;
        }

        const response = await fetch(`${server}/search/query=${searchQuery}`);
        const data = await response.json();

        setSearchValues(data);
    }

    const handleSearchQueryChange = (e: any) => {
        setSearchQuery(e.target.value);
        search();
    }

    const handleSearchSubmit = (e: any) => {
        e.preventDefault();
        search();
    }

    const togglePost = () => {
        setPostOpened(!postOpened);
        setPostOutfit('');
    }

    const openPostCreator = (outfit: any) => {
        setPostOpened(true)
        setPostOutfit(outfit);
    }

    const uploadPost = async (form: any) => {
        closePostCreator();
        const token = getToken();
        await fetch(`${server}/content/${token}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
    }


    const closePostCreator = () => {
        setPostOpened(false);
        setPostOutfit('');
    }

    const handleNavigate = (route: string) => {
        navigate(route);
        setSearchOpen(false);
    }

    return (
        <>
            {userData ? (
                <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
                    <header
                        className={`px-6 py-2 bg-white dark:bg-gray-800 z-30 shadow ${isSidebarOpen && !isDesktopOrLaptop && "hidden"}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <WavingHandIcon className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                    {t('hello')}, {userData.userName}
                                </h1>
                            </div>

                            {!isDesktopOrLaptop && (
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className={`text-gray-500 focus:outline-none focus:text-gray-600 ${isDesktopOrLaptop && "hidden"}`}
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="flex flex-1 overflow-hidden">
                        <aside className={`transform top-0 left-0 ${!isSearchOpen && ('w-64')} bg-white dark:bg-gray-800 p-4 overflow-y-auto fixed h-full z-30 transition-transform duration-200 ease-in-out ${!isSidebarOpen && "-translate-x-full"} md:translate-x-0 md:static`}>                            <nav className="flex flex-col justify-between h-full">
                            <div className="space-y-1">
                                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                                    <ArrowBackIosIcon color="info" />
                                </button>
                                <NavLink className={({isActive, isPending }) => isPending ? "pending" : `flex items-center px-3 py-2 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`} to="/">
                                    <HomeIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Home')}
                                </NavLink>
                                <button onClick={toggleSearch} className=" min-w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all">
                                    <SearchIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Search')}
                                </button>
                                <button onClick={togglePost} className=" min-w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all">
                                    <AddBoxIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Post')}
                                </button>
                                <NavLink className={({isActive, isPending }) => isPending ? "pending" : `flex items-center px-3 py-2 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`} to="/messages">
                                    <MessageIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Messages')}
                                    {!isSearchOpen && (<span className="ml-auto inline-block bg-gray-800 dark:bg-white text-white dark:text-black font-bold text-xs px-2 py-1 rounded-full">{0}</span>
                                    )}
                                </NavLink>
                                <NavLink className={({isActive, isPending }) => isPending ? "pending" : `flex items-center px-3 py-2 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`} to="/explore">
                                    <DensityMediumIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Explore')}
                                </NavLink>
                                <NavLink className={({isActive, isPending }) => isPending ? "pending" : `flex items-center px-3 py-2 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`} to="/dashboard">
                                    <DashboardIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Dashboard')}
                                </NavLink>
                                <NavLink className={({isActive, isPending }) => isPending ? "pending" : `flex items-center px-3 py-2 ${isActive ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all`} to="/admin">
                                    <AdminPanelSettingsIcon className="w-5 h-5 mr-2" />
                                    {!isSearchOpen && ('Admin')}
                                </NavLink>
                            </div>
                            <div className="space-y-1">
                                <Link className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all" to={`/u/${userData.userName}`}>
                                    {userData.imagePath === "" || userData.imagePath === null ? (
                                        <PersonIcon />
                                    ) : (
                                        <img className="w-7 h-7 mr-2 rounded-3xl" src={userData.imagePath} alt={`${userData.userName}'s Profile`} />
                                    )}
                                    {!isSearchOpen && ('Profile')}
                                </Link>
                            </div>
                        </nav>
                        </aside>
                        {isSearchOpen && (
                            <div className="min-h-full dark:bg-gray-800 max-w-fit py-4">
                                <form onSubmit={handleSearchSubmit} className="flex items-center justify-center">
                                    &nbsp;
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchQueryChange}
                                        placeholder="Search..."
                                        className="dark:text-white dark:bg-gray-900 rounded-md py-2 px-4 mr-2 focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </form>
                                <br />
                                <div className="flex flex-col items-center">
                                    {searchValues && searchValues.map((value, index) => (
                                        <div key={index} className="w-full flex items-center mb-2">
                                            {value.type === "User" && (
                                                <>
                                                    <button onClick={() => handleNavigate(value.path)} className="min-w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all">
                                                        <AccountCircleIcon className="w-5 h-5 mr-2" />
                                                        {value.name}
                                                    </button>
                                                </>
                                            )}
                                            {value.type === "Post" && (
                                                <>
                                                    <button onClick={() => handleNavigate(value.path)} className="min-w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all">
                                                        <CheckroomIcon className="w-5 h-5 mr-2" />
                                                        {value.name}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <main className={`flex-1 p-4 overflow-y-auto`}>
                            {postOpened && (
                                <>
                                    <PostCreator
                                        onSave={uploadPost}
                                        onClose={closePostCreator}
                                        outfit={postOutfit}
                                    />
                                </>
                            )}
                            <div className={` ${postOpened && ('blur')}`}>
                                <Routes>
                                    <Route path="/" element={< IndexView user={userData} />} />
                                    <Route path="/creator/*" element={< CreatorView user={userData} />} />
                                    <Route path="/settings/*" element={<SettingsView user={userData} />} />
                                    <Route path="/o/:id" element={< PostView user={userData} />} />
                                    <Route path="messages/*" element={< MessagesView user={userData} />} />
                                    <Route path="/u/:name" element={< UserView user={userData} />} />
                                    <Route path="/c/:id" element={< ComponentView user={userData}/>} />
                                    <Route path="/dashboard/*" element={<Dashboard user={userData} postCreator={openPostCreator} />} />
                                    <Route path="/explore/*" element={<Explore user={userData} />} />
                                    <Route path="/admin/*" element={< AdminView user={userData} />} />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                        <CenteredLoader />
                    </div>
                </>
            )}
        </>
    );
}

const IndexView = ({ user }: UserPropInterface) => {
    document.title = "Home";
    const [posts, setPosts] = useState<any[]>([]);
    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/content/${token}/gethomebyfollowing`);

            const data = await response.json();
            const newData = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPosts(newData)
        }
        load();
    }, [])
    return (
        <>
            <PageHeader>Home</PageHeader>
            <div className="mx-auto max-w-lg px-4 py-8">
                {posts && posts.map((post, index) => (
                    <div key={index}>
                        <Post
                            id={post.id}
                            user={user}
                            creator={post.creator}
                            image={post.outfit.image}
                            description={post.description}
                            created={post.createdAt}
                            HasReacted={post.hasReacted}
                            IsLiked={post.isLiked}
                        />
                        <br />
                    </div>
                ))}
            </div>
        </>
    )
}


const Post = ({ id, user, creator, image, description, created, HasReacted, IsLiked }: any) => {
    const [isLiked, setLiked] = useState(false);
    const [commentsShown, setCommentsShown] = useState(false);
    const [isShareShown, setShareShown] = useState(false);

    const navigate = useNavigate();

    const toggleComments = () => {
        setCommentsShown(!commentsShown);
    }

    useEffect(() => {
        if (HasReacted) {
            if (IsLiked) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [HasReacted, IsLiked])

    const handleLike = async () => {
        const token = getToken();;
        const response = await fetch(`${server}/content/${token}/post/${id}/${isLiked ? 'dislike' : 'like'}`, {
            method: 'POST'
        });
        setLiked(await response.json());

    }

    const handleNavigate = () => {
        navigate(`/o/${id}`);
    }

    const button = document.getElementById('btn-' + id);
    button?.addEventListener('dblclick', handleLike);
    button?.addEventListener('click', handleNavigate);

    const openShareUI = () => {
        setShareShown(true);
    }

    const closeShareUI = () => {
        setShareShown(false);
    }

    return (
        <>
        {isShareShown && (
            <ShareUI 
                post={id}
                onClose={closeShareUI}
            />
        )}
            <div className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-md shadow-md w-full max-w-md mx-auto">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                        {creator.image === "" || creator.image === null ? (
                            <PersonIcon />
                        ) : (
                            <Avatar alt="@shadcn" src={creator.image}/>
                        )}
                    </Avatar>
                    <div className="text-sm">
                        <Link to={`/u/${creator.userName}`} className="font-medium dark:text-white">{creator.userName}</Link>
                        <p title={formatTime(created)} className="text-gray-500 dark:text-gray-400">Posted {formatChatTime(new Date(created))}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <button id={`btn-${id}`}>
                        <img
                            alt="Post"
                            className="aspect-square object-cover rounded-md"
                            height={400}
                            src={image}
                            width={400}
                        />
                    </button>
                    <p className="mt-2 text-sm dark:text-white">{description}</p>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                    <button title="React" className="transition-all hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLike}>
                        {isLiked ? (
                            <HeartIconFilled className="w-4 h-4" />
                        ) : (
                            <HeartIcon className="w-4 h-4" />
                        )}
                        <span className="sr-only">Like</span>
                    </button>
                    <button onClick={toggleComments} title="Comment" className={`transition-all ${commentsShown && ('bg-green-700')} hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}>
                        <MessageCircleIcon className="w-4 h-4" />
                        <span className="sr-only">Comment</span>
                    </button>
                    <button onClick={openShareUI} title="Share" className="transition-all hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        <SendIcon className="w-4 h-4" />
                        <span className="sr-only">Share</span>
                    </button>
                </div>
                {commentsShown && (
                <CommentSection 
                    postId={id}
                    user={user}
                />
            )}
            </div>
        </>
    )
}



function HeartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}

function HeartIconFilled(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}


function MessageCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
    )
}


function SendIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    )
}