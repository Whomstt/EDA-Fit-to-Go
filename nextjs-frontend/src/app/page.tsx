"use client";

import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  likecount: number;
  commentcount: number;
  sharecount: number;
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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 bg-white shadow-md rounded-lg w-2/3">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-lg mb-2">
              Likes: {post.likecount}, Comments: {post.commentcount}, Shares: {post.sharecount}
            </p>
          </div>
        ))
      ) : (
        <p className="text-xl text-gray-700">Loading posts...</p>
      )}
    </main>
  );
}
