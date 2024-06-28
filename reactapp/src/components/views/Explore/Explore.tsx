import { Link, Route, Routes } from "react-router-dom"
import { CenteredLoader, PageHeader } from "../Utils"
import { useEffect, useState } from "react"
import { server } from "../../../App"
import { getToken } from "../../api/Utils"
import { UserPropInterface } from "../../etc/UserPropInterface"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';


export const Explore = ({ user }: UserPropInterface) => {
    return (
        <>
            <Routes>
                <Route path="/" element={< View user={user} />} />
            </Routes>
        </>
    )
}

const View = ({ user }: UserPropInterface) => {
    document.title = "Explore";
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const token = getToken();
            const response = await fetch(`${server}/content/${token}/explore`);
            const data = await response.json();

            setPosts(data);
        };

        load();
    }, []);

    if (!posts.length) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <CenteredLoader />
            </div>
        )
    }

    return (
        <div className="p-8">
            <PageHeader>Explore</PageHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Post key={post.id} post={post} setPosts={setPosts} posts={posts} />
                ))}
            </div>
        </div>
    );
};

const Post = ({ post, setPosts, posts }: any) => {
    const [isLiked, setLiked] = useState(false);

    useEffect(() => {
        if (post.hasReacted) {
            if (post.isLiked) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
    }, [post.hasReacted, post.isLiked])

    const handleLike = async () => {
        const token = getToken();;
        const response = await fetch(`${server}/content/${token}/post/${post.id}/${isLiked ? 'dislike' : 'like'}`, {
            method: 'POST'
        });
        const likeData = await response.json()
        setLiked(likeData);
        const updatedPost = { ...post };
        updatedPost.likes = isLiked ? updatedPost.likes - 1 : updatedPost.likes + 1;
        const postIndex = posts.findIndex((p: any) => p.id === post.id);
        if (postIndex === -1) return;

        const updatedPosts = [...posts];
        updatedPosts[postIndex] = updatedPost;
    
        setPosts(updatedPosts);    
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={post.outfit.image} alt="post" className="w-full h-60 object-cover" />
            <div className="flex items-center justify-between p-4">
                <button onClick={handleLike} className={`flex items-center dark:text-gray-200 ${isLiked ? ('hover:bg-green-500/20') : ('hover:bg-gray-200 dark:hover:bg-white/10')} py-1 px-2 rounded-md transition-all`}>
                    <ThumbUpIcon className="mr-1" />
                    <span>{post.likes} Like{post.likes !== 1 && 's'}</span>
                </button>
                <div className="dark:text-gray-200">
                    <Link to={`/u/${post.creator.userName}`}>{post.creator.userName}</Link>
                </div>
                <Link to={`/o/${post.id}`} className="text-blue-500 hover:text-blue-600 transition-color duration-300">
                    View
                </Link>
            </div>
        </div>
    );
};