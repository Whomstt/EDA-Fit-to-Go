'use client';

import React, { useState } from 'react';
import { Post } from './types/Post';

const apiBase = '/api/post';

const PostList = ({ posts }: { posts: Post[] }) => {
  const [localPosts, setLocalPosts] = useState(posts.map(post => ({ ...post, liked: false })));
  const [shareLink, setShareLink] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLike = async (id: number) => {
    setLocalPosts(prevPosts => prevPosts.map(post => post.id === id ? {
      ...post,
      liked: !post.liked,
      likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1
    } : post));

    try {
      const post = localPosts.find(p => p.id === id)!;
      await toggleLike(id, post.liked);
    } catch {
      setLocalPosts(prevPosts => prevPosts.map(post => post.id === id ? { ...post, liked: !post.liked } : post));
    }
  };

  const toggleLike = async (id: number, liked: boolean) => {
    const endpoint = liked ? 'decrement' : 'increment';
    try {
      const response = await fetch(`${apiBase}/${id}/${endpoint}/likecount`, { method: 'PUT' });
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  const handleShare = (id: number) => {
    const link = `${window.location.origin}/post/${id}`;
    setShareLink(link);  // Set the shareable link
    setShowModal(true);   // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const handleComment = async (id: number) => {
    console.log("Comment button clicked");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {localPosts.map(post => (
        <div key={post.id} className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{post.title}</h2>
          <div className="flex space-x-4">
            <p className="text-lg mb-2 text-gray-700">Likes: {post.likeCount}</p>
            <p className="text-lg mb-2 text-gray-700">Comments: {post.commentCount}</p>
            <p className="text-lg mb-2 text-gray-700">Shares: {post.shareCount}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => handleLike(post.id)}
              className={`px-4 py-2 rounded transition-colors ${post.liked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              {post.liked ? 'Unlike' : 'Like'}
            </button>
            <button
              onClick={() => handleComment(post.id)}
              className={`px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white`}
            >
              Comment
            </button>
            <button
              onClick={() => handleShare(post.id)}
              className={`px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white`}
            >
              Share
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Share This Post</h2>
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mb-4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
