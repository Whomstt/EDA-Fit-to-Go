// PostList (client-side, handles increment actions)

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

// Function to increment the count for likes, comments, or shares
const incrementCount = async (id: number, type: keyof Post): Promise<void> => {
  try {
    const response = await fetch(`${apiBase}/${id}/increment/${type.toLowerCase()}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      const errMsg = await response.text();
      console.error(`Error incrementing ${type} count: ${errMsg}`);
    }
  } catch (error) {
    console.error(`Error incrementing ${type} count`, error);
  }
};

const PostList = ({ posts }: { posts: Post[] }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>(posts);

  // Handle incrementing count for like, comment, or share
  const handleIncrement = async (id: number, type: keyof Post) => {
    await incrementCount(id, type);
    // Update local state to reflect the new count with a short delay
    setTimeout(() => {
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? { ...post, [type]: (post[type] as number) + 1 }
            : post
        )
      );
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {localPosts.length > 0 ? (
        localPosts.map((post) => (
          <div key={post.id} className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{post.title}</h2>
            <p className="text-lg mb-2 text-gray-700">
              Likes: {post.likeCount}, Comments: {post.commentCount}, Shares:{' '}
              {post.shareCount}
            </p>
            <div>
              <button
                onClick={() => handleIncrement(post.id, 'likeCount')}
                className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:brightness-75 transition duration-200"
              >
                Like
              </button>
              <button
                onClick={() => handleIncrement(post.id, 'commentCount')}
                className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:brightness-75 transition duration-200"
              >
                Comment
              </button>
              <button
                onClick={() => handleIncrement(post.id, 'shareCount')}
                className="bg-red-500 text-white py-1 px-2 rounded hover:brightness-75 transition duration-200"
              >
                Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl text-gray-700">No posts available</p>
      )}
    </div>
  );
};

export default PostList;
