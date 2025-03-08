import { Post } from '../types/Post';


export const toggleLike = async (id: number, liked: boolean): Promise<void> => {
  const endpoint = liked ? 'increment' : 'decrement';
  const response = await fetch(`/api/post/${id}/${endpoint}/likecount`, {
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Failed to toggle like: ${await response.text()}`);
  }
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/post/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return await response.json();
};

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
};
