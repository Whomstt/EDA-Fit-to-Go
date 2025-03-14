import { Post } from '../types/Post';
import { Comment } from '../types/Comment';



export const toggleLike = async (id: number, liked: boolean): Promise<void> => {
  const endpoint = liked ? 'increment' : 'decrement';
  const response = await fetch(`http://localhost:8080/api/post/${id}/${endpoint}/likecount`, {
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Failed to toggle like: ${await response.text()}`);
  }
};

export const actionComment = async (id: number): Promise<void> => {
  const endpoint = "increment";
  const response = await fetch(`http://localhost:8080/api/post/${id}/${endpoint}/commentcount`, {
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Failed to increment comment count: ${await response.text()}`);
  }
};

export const actionShare = async (id: number): Promise<void> => {
  const endpoint = "increment";
  const response = await fetch(`http://localhost:8080/api/post/${id}/${endpoint}/sharecount`, {
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Failed to increment share count: ${await response.text()}`);
  }
};

export const fetchPostById = async (id: number): Promise<Post> => {
  const response = await fetch(`http://localhost:8080/api/post/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return await response.json();
};


export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('http://localhost:8080//api/post/all');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
};

export const fetchCommentsByPostId = async (id: number): Promise<Comment[]> => {
  const response = await fetch(`http://localhost:8080/api/post/${id}/comments`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  const text = await response.text();
  try {
    return JSON.parse(text) as Comment[];
  } catch (error) {
    throw new Error("Invalid JSON response: " + error);
  }
};

export const addComment = async (id: number, commentText: string): Promise<Comment> => {
  const response = await fetch(`http://localhost:8080/api/post/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: commentText }),
  });
  if (!response.ok) {
    throw new Error(`Failed to add comment: ${await response.text()}`);
  }
  return await response.json();
};

