'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '../types/Post';


export interface PostCardProps {
  post: Post;
  onLike: (id: number, liked: boolean) => Promise<void>;
  onComment: (id: number) => void;
  onShare: (id: number) => void;
  showLink: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare, showLink }) => {
  const [localPost, setLocalPost] = useState({ ...post, liked: false });

  const handleLike = async () => {
    try {
      const newLiked = !localPost.liked;
      setLocalPost({
        ...localPost,
        liked: newLiked,
        likeCount: newLiked ? localPost.likeCount + 1 : localPost.likeCount - 1,
      });
      await onLike(localPost.id, newLiked);
    } catch (error) {
      setLocalPost({
        ...localPost,
        liked: !localPost.liked,
        likeCount: localPost.liked ? localPost.likeCount - 1 : localPost.likeCount + 1,
      });
    }
  };

  return (
    <div className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        {showLink ? (
          <Link href={`/post/${localPost.id}`}>{localPost.title}</Link>
        ) : (
          localPost.title
        )}
      </h2>
      <div className="flex space-x-4">
        <p className="text-lg mb-2 text-gray-700">Likes: {localPost.likeCount}</p>
        <p className="text-lg mb-2 text-gray-700">Comments: {localPost.commentCount}</p>
        <p className="text-lg mb-2 text-gray-700">Shares: {localPost.shareCount}</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded transition-colors ${
            localPost.liked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {localPost.liked ? 'Unlike' : 'Like'}
        </button>
        <button
          onClick={() => onComment(localPost.id)}
          className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
        >
          Comment
        </button>
        <button
          onClick={() => onShare(localPost.id)}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
