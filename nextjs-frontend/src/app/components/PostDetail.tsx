'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard';
import { Post } from '../types/Post';
import { fetchPostById, fetchCommentsByPostId, toggleLike, actionComment, actionShare } from '../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleCommentAction,
  handleShareAction,
} from '../utils/postActions';
import { mockPosts } from '../lib/mockPosts';
import { Comment } from '../types/Comment';

export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    // Fetch post and comments
    (async () => {
      try {
        // Fetch post details
        const data = await fetchPostById(Number(id));
        setPost({ ...data, liked: false });

        // Fetch comments for the post
        const commentsData = await fetchCommentsByPostId(Number(id));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post or comments:', error);

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
  {/* <button
    className="absolute top-4 left-4 p-2 bg-blue-500 hover:bg-blue-600 shadow-md rounded-lg"
    onClick={() => router.back()}
  >
    Back
  </button> */}
  <PostCard
    post={post}
    onLike={handleLike}
    onComment={handleComment}
    onShare={handleShare}
    showLink={false}
    isDetailPage={true}
  />
  <section className="w-full max-w-2xl p-4 mt-4 bg-white shadow-md rounded-lg text-black">
    <h2 className="text-xl font-bold mb-4">Comments</h2>
    {comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="p-2 border-b border-gray-200">
          <p>{comment.comment}</p>
        </div>
      ))
    ) : (
      <p>No comments yet.</p>
    )}
  </section>
</main>

  );
}
