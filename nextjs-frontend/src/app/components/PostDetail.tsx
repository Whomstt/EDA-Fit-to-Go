'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard';
import { Post } from '../types/Post';
import { fetchPostById, toggleLike, actionComment, actionShare } from '../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleCommentAction,
  handleShareAction,
} from '../utils/postActions';
import { mockPosts } from '../lib/mockPosts';


export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // Convert the id to a number and fetch the post data
        const data = await fetchPostById(Number(id)); // Convert id to a number
        setPost({ ...data, liked: false });
      } catch (error) {
        console.error('Error fetching post, falling back to mock data:', error);
        // Use mock post if available
        const fallback = mockPosts.find(p => p.id.toString() === id);
        if (fallback) {
          setPost(fallback);
        }
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

  const handleComment = async (postId: number) => {
    if (!post) return;
    try {
      await actionComment(postId);
      setPost(handleCommentAction(post));
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleShare = async (postId: number) => {
    if (!post) return;
    try {
      await actionShare(postId);
      setPost(handleShareAction(post));
    } catch (error) {
      console.error('Error sharing post:', error);
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
      <button
        className="absolute top-32 left-4 p-2 bg-blue-500 hover:bg-blue-600 shadow-md rounded-lg w-1/10"
        onClick={() => router.back()}
      >
        Back
      </button>
      <PostCard
        post={post}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        showLink={false}
      />
    </main>
  );
}
