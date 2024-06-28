import { Avatar, Menu, MenuItem } from "@mui/joy";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, FC, ReactNode, FormEvent } from "react";
import { formatChatTime, getToken, sendChatMessage } from "../api/Utils";
import { server } from "../../App";

import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const BackIcon = () => {
    return (
        < ArrowBackIcon />
    )
}

interface BaseHeaderProps {
    children: ReactNode;
}

export const PageHeader: React.FC<BaseHeaderProps> = ({ children }) => {
    return (
        <h2 className="dark:text-white ml-3">{children}</h2>
    )
}

interface HeaderProps {
    routing: string;
    children: ReactNode;
}

export const PageHeaderWithBackrouting: React.FC<HeaderProps> = ({ routing, children }) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(routing);
    }
    return (
        <>
            <div className="flex items-center">
                <button onClick={handleNavigate} className="dark:text-white">
                    <BackIcon />
                </button>
                <h2 className="dark:text-white ml-3">{children}</h2>
            </div>
        </>
    )
}


export const CenteredLoader = () => {
    return (
        <div className="text-center">
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

interface IComment {
    id: number;
    user: any;
    text: string;
    created: string;
}

export const CommentSection = ({ postId, user }: any) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [newCommentText, setNewCommentText] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/content/${token}/${postId}/comments`);
            const data = await response.json();
            setComments(data);
        };

        load();
    }, [postId]);

    const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newCommentText.trim() !== '') {
            const newComment: IComment = { id: comments.length + 1, text: newCommentText, created: new Date().toString(), user: { userName: user.userName, image: user.imagePath } };
            setComments([...comments, newComment]);
            const token = getToken();
            await fetch(`${server}/content/${token}/${postId}/comments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: newCommentText
                })
            })
            setNewCommentText('');
        }
    };

    return (
        <div className="mt-4">
            <h2 className="font-semibold text-lg dark:text-white px-4">Comments</h2>
            <div className="mt-2 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
                <form
                    onSubmit={handleAddComment}
                    className="flex shadow-lg rounded-lg"
                    style={{ position: "sticky", bottom: 0 }}
                >
                    <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Type a message..."
                        aria-label="Message"
                        className="dark:bg-gray-900 bg-white block w-full rounded-full border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 dark:placeholder:text-white dark:text-white dark:focus:dark:border-blue-700"
                    />
                    <div className="m-4 absolute inset-y-0 flex items-center right-4">
                        <button
                            type="submit"
                            aria-label="Submit"
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-blue-700 dark:hover:bg-blue-900"
                        >
                            <svg viewBox="0 0 16 6" aria-hidden="true" className="w-4">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16 3 10 .5v2H0v1h10v2L16 3Z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </form>
                {comments.map((comment, index) => (
                    <Comment key={index} id={comment.id} image={comment.user.image} username={comment.user.userName} text={comment.text} time={comment.created} user={user} comments={comments} setComments={setComments} />
                ))}
            </div>
        </div>
    )
}
const Comment = ({ id, username, image, time, text, user, comments, setComments }: any) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        if (anchorEl == null) {
            setAnchorEl(event.currentTarget);
        } else {
            setAnchorEl(null);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleClose();
        const cmds = comments.filter((c: any) => c.id !== id);
        setComments(cmds);
        const token = getToken();
        fetch(`${server}/content/${token}/comments/${id}/remove`, {
            method: 'DELETE'
        });
    }

    const handleReport = () => {
        handleClose();
    }

    const handleCopy = () => {
        handleClose();
        navigator.clipboard.writeText(text);
    }

    return (
       <div className="flex items-start space-x-3 mt-4">
            <Avatar className="w-8 h-8">
                {image === "" || image === null ? (
                    <PersonIcon />
                ) : (
                    <img src={image} alt={`${username}'s Profile`} />
                )}
            </Avatar>
            <div className="flex-1">
                <Link to={`/u/${username}`} className="font-medium dark:text-white">{username}</Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatChatTime(new Date(time))}</p>
                <p className="mt-1 text-sm dark:text-white">{text}</p>
            </div>
            <button className="focus:outline-none dark:text-gray-400" onClick={handleClick}>
                <MoreVertIcon />
            </button>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {username === user.userName && (
                    <MenuItem onClick={handleDelete}>Löschen</MenuItem>
                )}
                <MenuItem onClick={handleReport}>Melden</MenuItem>
                <MenuItem onClick={handleCopy}>Kopieren</MenuItem>
            </Menu>
        </div>
    )
}


type ResolveRejectFn = (value: boolean | PromiseLike<boolean>) => void;

export const useConfirm = (message: string) => {
    const [resolve, setResolve] = useState<ResolveRejectFn | null>(null);
    const [reject, setReject] = useState<ResolveRejectFn | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && resolve !== null && reject !== null) {
            setIsOpen(false);
            setResolve(() => null);
            setReject(() => null);
        }
    }, [isOpen, reject, resolve]);

    const showDialog = () =>
        new Promise<boolean>((res, rej) => {
            setIsOpen(true);
            setResolve(() => res);
            setReject(() => rej);
        });

    const confirm = () => {
        if (resolve) resolve(true);
    };

    const cancel = () => {
        if (reject) reject(false);
    };

    return [isOpen, showDialog, confirm, cancel, message] as const;
};

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: ReactNode;
}


export const ConfirmModal: FC<ModalProps> = ({ open, onClose, onConfirm, children }) => {
    if (!open) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="absolute inset-0 blur backdrop-filter backdrop-blur-lg"></div>
                <div className="p-4 bg-gray-800 rounded-lg shadow-xl relative w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
                    <h3 className="text-lg leading-6 font-medium text-white">{children}</h3>
                    <div className="mt-5 flex justify-end">
                        <button
                            className="mr-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-700 transition-colors duration-200"
                            onClick={onConfirm}
                        >
                            Yes
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors duration-200"
                            onClick={onClose}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const ShareUI = ({ onClose, post }: any) => {
    const [chats, setChats] = useState<any[]>([]);

    const sendChat = (chat: string) => {
        sendChatMessage(chat, `[sharedOutfit=${post}]`);
        onClose();
    }

    useEffect(() => {
        const loadChats = async () => {
            const token = getToken();
            const response = await fetch(`${server}/messages/${token}/load`);
            const data = await response.json();
            setChats(data);
        }
        loadChats();
    }, [])

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" onClick={onClose}></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                    <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:my-8 sm:p-6">
                        <h1 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Send Outfit</h1>
                        {chats && chats.map((chat, index) => (
                            <div key={index} className="mt-2 flex items-center space-x-3 py-2">
                                <img src={chat.image} className="h-8 w-8 rounded-full" alt={`${chat.name}'s Profile`} />
                                <button onClick={() => { sendChat(chat.name) }} className="text-blue-500">{chat.name}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}