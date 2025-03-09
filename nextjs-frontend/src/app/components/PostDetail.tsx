'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { Post } from '../types/Post';
import { fetchPostById, toggleLike } from '../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleCommentAction,
  handleShareAction,
} from '../utils/postActions';
import { mockPosts } from '../lib/mockPosts';


export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);

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
}
