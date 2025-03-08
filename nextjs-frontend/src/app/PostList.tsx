'use client';

import React, { useState } from 'react';

interface Post {
  id: number;
  title: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

const apiBase = '/api/post';

const incrementCount = async (id: number, type: 'like'|'unlike') => {
  const endpoint = type === 'like' ? 'increment' : 'decrement';
  try {
    const response = await fetch(`${apiBase}/${id}/${endpoint}/likecount`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error(await response.text());
  } catch (error) {
    console.error(`Error ${type}ing post:`, error);
    throw error;
  }
};

const PostList = ({ posts }: { posts: Post[] }) => {
  const [localPosts, setLocalPosts] = useState(posts.map(post => ({
    ...post,
    liked: false // Initial local state for UI
  })));

  const handleLike = async (id: number) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id !== id) return post;
      const newLiked = !post.liked;
      return {
        ...post,
        liked: newLiked,
        likeCount: newLiked ? post.likeCount + 1 : post.likeCount - 1
      };
    }));

    try {
      const post = localPosts.find(p => p.id === id)!;
      await incrementCount(id, post.liked ? 'unlike' : 'like');
    } catch (error) {
      // Revert on error
      setLocalPosts(prev => prev.map(post => {
        if (post.id !== id) return post;
        return { ...post, liked: !post.liked, likeCount: post.likeCount };
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {localPosts.map((post) => (
        <div key={post.id} className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{post.title}</h2>
          <p className="text-lg mb-2 text-gray-700">Likes: {post.likeCount}</p>
          <button
            onClick={() => handleLike(post.id)}
            className={`px-4 py-2 rounded transition-colors ${
              post.liked 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {post.liked ? 'Unlike' : 'Like'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;