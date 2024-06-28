import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Link, useParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import { getToken } from "../../api/Utils";
import { server } from "../../../App";
import { CenteredLoader, CommentSection, ShareUI } from "../Utils";
import { useEffect, useState } from "react";
import { UserPropInterface } from "../../etc/UserPropInterface";

import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export const PostView = ({ user }: UserPropInterface) => {
    const { id } = useParams();

    const [post, setPost] = useState<any>();
    const [isLiked, setLiked] = useState(false);
    const [isSaved, setSaved] = useState(false);
    const [isShareShown, setShareShown] = useState(false);

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/content/${token}/post/${id}`);
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            setPost(data);
            if (data.hasReacted) {
                if (data.isLiked) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
                setSaved(data.isSaved);
            }
        }

        load();
    }, [id])

    const openShareUI = () => {
        setShareShown(true);
    }

    const closeShareUI = () => {
        setShareShown(false);
    }

    const handleLike = async () => {
        const token = getToken();;
        const response = await fetch(`${server}/content/${token}/post/${id}/${isLiked ? 'dislike' : 'like'}`, {
            method: 'POST'
        });
        setLiked(await response.json());
    }

    const handleSave = async () => {
        const token = getToken();
        const response = await fetch(`${server}/content/${token}/post/${id}/${isSaved ? 'unsave' : 'save'}`, {
            method: 'POST'
        });
        setSaved(await response.json());
    }

    return (
        <>
            {post ? (
                <>
                    {isShareShown && (
                        <ShareUI
                            post={id}
                            onClose={closeShareUI}
                        />
                    )}
                    <div className="post bg-white dark:bg-gray-800 mx-auto mt-16 rounded-lg shadow-lg overflow-hidden max-w-full sm:max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center">
                                <img
                                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-400"
                                    src={post.creator.image}
                                    alt={`${post.creator.userName}'s Profile`}
                                />
                                <div className="ml-4">
                                    <h1 className="text-sm tracking-wider text-gray-700 font-semibold dark:text-gray-200">
                                        <Link to={`/u/${post.creator.userName}`}>{post.creator.userName}</Link>
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-content">
                            <Carousel>
                                {post.outfit.components && post.outfit.components.map((component: any) => (
                                    <div className="flex flex-col items-center">
                                        <img className="rounded-sm shadow-sm" src={component.image} alt={`Component ${component.name}`} />
                                        <p className="text-sm mt-2 font-medium text-center">
                                            <Link className="underline text-gray-600 hover:text-black dark:text-gray-200" to={`/c/${component.id}`}>{component.name}</Link>
                                        </p>
                                    </div>
                                ))}
                            </Carousel>
                            <div className="px-6 py-4">
                                <img className="rounded-sm shadow-sm object-cover w-full h-64" src={post.outfit.image} alt={post.outfit.name} />
                                <h1 className="mt-4 text-lg text-gray-800 font-semibold tracking-wide truncate dark:text-gray-200">{post.outfit.name}</h1>
                                <p className="mt-2 text-gray-600 text-sm break-words dark:text-gray-200">{post.description}</p>
                            </div>
                        </div>

                        <div className="post-footer flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-700">
                            <button title="React" className="transition-all hover:bg-gray-400/40 text-white font-bold py-2 px-4 rounded" onClick={handleLike}>
                                {isLiked ? (
                                    <HeartIconFilled className="w-4 h-4" />
                                ) : (
                                    <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="sr-only">Like</span>
                            </button>
                            <button title="Save" className="transition-all hover:bg-gray-400/40 text-white font-bold py-2 px-4 rounded" onClick={handleSave}>
                                {isSaved ? (
                                    <BookmarkIcon className="w-4 h-4" />
                                ) : (
                                    <BookmarkBorderIcon className="w-4 h-4" />
                                )}
                                <span className="sr-only">Save</span>
                            </button>
                            <button onClick={openShareUI} title="Share" className="transition-all hover:bg-gray-400/40 text-white font-bold py-2 px-4 rounded">
                                <SendIcon className="w-4 h-4" />
                                <span className="sr-only">Share</span>
                            </button>
                        </div>

                        <CommentSection postId={id} user={user} />
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