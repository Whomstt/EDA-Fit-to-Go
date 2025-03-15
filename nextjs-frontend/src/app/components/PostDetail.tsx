'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from './PostCard';
import { Post } from '../types/Post';
import { 
  fetchPostById, 
  fetchCommentsByPostId, 
  toggleLike, 
  actionShare,
  addComment
} from '../api/posts';
import {
  updatePostLike,
  revertPostLike,
  handleShareAction,
} from '../utils/postActions';
import { mockPosts } from '../lib/mockPosts';
import { mockComments } from '../lib/mockComments';
import { Comment } from '../types/Comment';

export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await fetchPostById(Number(id));
        setPost({ ...data, liked: false });

        const commentsData = await fetchCommentsByPostId(Number(id));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post or comments:', error);
        const fallbackPost = mockPosts.find(p => p.id.toString() === id);
        if (fallbackPost) {
          setPost(fallbackPost);

        const fallbackComments = mockComments.filter(c => c.postId === fallbackPost.id);
        setComments(fallbackComments);
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

  const handleCommentNavigation = async (postId: number) => {
    const commentTextArea = document.getElementById('comment-textarea');
    if (commentTextArea) {
      commentTextArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (commentTextArea as HTMLTextAreaElement).focus();
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

  const handleAddComment = async () => {
    if (!post || !newComment.trim()) return;

    setPost(prevPost => ({
      ...prevPost!,
      commentCount: prevPost!.commentCount + 1,
    }));

    try {
      const addedComment = await addComment(post.id, newComment);
      setComments(prevComments => [...prevComments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setPost(prevPost => ({
        ...prevPost!,
        commentCount: prevPost!.commentCount - 1,
      }));
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
    onComment={handleCommentNavigation}
    onShare={handleShare}
    showLink={false}
    isDetailPage={true}
  />
  <section className="w-full max-w-2xl p-4 mt-4 bg-white shadow-md rounded-lg text-black flex flex-col">
    <h2 className="text-xl font-bold mb-4">Comments</h2>
    <div
      className="overflow-y-auto border border-gray-200 rounded-lg p-2"
      style={{ maxHeight: '300px' }}
    >
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="p-2 border-b border-gray-200">
            <p>{comment.comment}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
    <div className="mt-4">
      <textarea
        id="comment-textarea"
        className="w-full border border-gray-300 p-2 rounded-lg"
        placeholder="Add your comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        onClick={handleAddComment}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Add Comment
      </button>
    </div>
  </section>
</main>

  );
}
