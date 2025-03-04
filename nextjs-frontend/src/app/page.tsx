"use client";

import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

const apiBase = "http://localhost:8080/api/post";

const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${apiBase}/all`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching posts", error);
    return [];
  }
};

const updateCount = async (id: number, type: string): Promise<Post | null> => {
  try {
    const response = await fetch(`${apiBase}/${id}/increment/${type}`, {
      method: "PUT",
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error(`Error updating ${type} count`, error);
    return null;
  }
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const incrementCount = async (id: number, type: keyof Post) => {
    const updatedPost = await updateCount(id, type);
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, [type]: updatedPost[type] } : post
        )
      );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{post.title}</h2>
            <p className="text-lg mb-2 text-gray-700">
              Likes: {post.likeCount}, Comments: {post.commentCount}, Shares: {post.shareCount}
            </p>
            <div>
              <button
                onClick={() => incrementCount(post.id, "likeCount")}
                className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
              >
                Like
              </button>
              <button
                onClick={() => incrementCount(post.id, "commentCount")}
                className="bg-green-500 text-white py-1 px-2 rounded mr-2"
              >
                Comment
              </button>
              <button
                onClick={() => incrementCount(post.id, "shareCount")}
                className="bg-red-500 text-white py-1 px-2 rounded"
              >
                Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl text-gray-700">Loading posts...</p>
      )}
    </main>
  );
}
