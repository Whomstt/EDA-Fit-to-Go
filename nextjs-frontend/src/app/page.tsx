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

// Fetch all posts from the API.
const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${apiBase}/all`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching posts", error);
    return [];
  }
};

// Trigger the increment endpoint. We no longer expect a JSON response.
const incrementCount = async (id: number, type: keyof Post): Promise<void> => {
  try {
    const response = await fetch(`${apiBase}/${id}/increment/${type.toLowerCase()}`, {
      method: "PUT",
    });
    if (!response.ok) {
      const errMsg = await response.text();
      console.error(`Error incrementing ${type} count: ${errMsg}`);
    }
  } catch (error) {
    console.error(`Error incrementing ${type} count`, error);
  }
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  // When a button is clicked, call the increment endpoint then refresh posts.
  const handleIncrement = async (id: number, type: keyof Post) => {
    await incrementCount(id, type);
    // Due to asynchronous processing through Kafka, we add a short delay before refreshing.
    setTimeout(() => {
      fetchPosts().then(setPosts);
    }, 500); // Adjust the delay as needed
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
                onClick={() => handleIncrement(post.id, "likeCount")}
                className="bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:brightness-75 transition duration-200"
              >
                Like
              </button>
              <button
                onClick={() => handleIncrement(post.id, "commentCount")}
                className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:brightness-75 transition duration-200"
              >
                Comment
              </button>
              <button
                onClick={() => handleIncrement(post.id, "shareCount")}
                className="bg-red-500 text-white py-1 px-2 rounded hover:brightness-75 transition duration-200"
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
