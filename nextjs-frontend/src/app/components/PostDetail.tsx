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

// Define mock posts for fallback
const mockPosts: Post[] = [
  { id: 1, title: "Mock Post 1", likeCount: 5, commentCount: 6, shareCount: 1, liked: false },
  { id: 2, title: "Mock Post 2", likeCount: 3, commentCount: 4, shareCount: 8, liked: false },
  { id: 3, title: "Mock Post 3", likeCount: 7, commentCount: 2, shareCount: 3, liked: false },
];

export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // Attempt to fetch the post data from the backend
        const data = await fetchPostById(id);
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
