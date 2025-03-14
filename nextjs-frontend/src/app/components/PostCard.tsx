'use client';

import React from 'react';
import Link from 'next/link';
import { Post } from '../types/Post';

export interface PostCardProps {
  post: Post;
  onLike: (id: number, liked: boolean) => Promise<void>;
  onComment: (id: number) => Promise<void>;
  onShare: (id: number) => Promise<void>;
  showLink: boolean;
  isDetailPage: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  showLink,
  isDetailPage = false,
}) => {
  // Use the post prop directly instead of maintaining local state

  const handleLike = async () => {
    try {
      const newLiked = !post.liked;
      await onLike(post.id, newLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async () => {
    if (isDetailPage) {
      const commentTextArea = document.getElementById('comment-textarea');
      if (commentTextArea) {
        commentTextArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (commentTextArea as HTMLTextAreaElement).focus();
      }
    } else {
      await onComment(post.id);
    }
  };

  const handleShare = async () => {
    try {
      await onShare(post.id);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">
        {showLink ? (
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        ) : (
          post.title
        )}
      </h2>
      <div className="flex space-x-4">
        <p className="text-lg mb-2 text-gray-700">Likes: {post.likeCount}</p>
        <p className="text-lg mb-2 text-gray-700">Comments: {post.commentCount}</p>
        <p className="text-lg mb-2 text-gray-700">Shares: {post.shareCount}</p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded transition-colors ${
            post.liked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {post.liked ? 'Unlike' : 'Like'}
        </button>
        <button
          onClick={handleComment}
          className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-600 text-white"
        >
          Comment
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
