'use client';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostCard from '../../components/PostCard';
import { Post } from '../../types/Post';
import { fetchPostById, toggleLike } from '../../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleCommentAction,
  handleShareAction,
} from '../../utils/postActions';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchPostById(Array.isArray(id) ? id[0] : id);
        setPost({ ...data, liked: false });
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    })();
  }, [id]);

  const handleLike = async (postId: number, liked: boolean) => {
    if (!post) return;
    try {
      await toggleLike(postId, liked);
      setPost(updatePostLike(post, liked));
    } catch (error) {
      console.error('Error toggling like:', error);
      setPost(revertPostLike(post, liked));
    }
  };

  if (!post) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <PostCard
        post={post}
        onLike={handleLike}
        onComment={handleCommentAction}
        onShare={handleShareAction}
        showLink={false}
      />
    </main>
  );
};

export default PostDetailPage;
