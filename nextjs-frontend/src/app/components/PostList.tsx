'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { Post } from '../types/Post';
import { toggleLike, actionComment, actionShare } from '../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleCommentAction,
  handleShareAction,
} from '../utils/postActions';

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  useEffect(() => {
    setLocalPosts(posts.map(post => ({ ...post, liked: false })));
  }, [posts]);

  const handleLike = async (id: number, liked: boolean) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(post => (post.id === id ? updatePostLike(post, liked) : post))
    );
    try {
      await toggleLike(id, liked);
    } catch (error) {
      setLocalPosts(prevPosts =>
        prevPosts.map(post => (post.id === id ? revertPostLike(post, liked) : post))
      );
    }
  };

  const handleComment = async (id: number) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(post => (post.id === id ? handleCommentAction(post) : post))
    );
    try {
      await actionComment(id);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleShare = async (id: number) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(post => (post.id === id ? handleShareAction(post) : post))
    );
    try {
      await actionShare(id);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {localPosts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          showLink={true}
        />
      ))}
    </div>
  );
};

export default PostList;
