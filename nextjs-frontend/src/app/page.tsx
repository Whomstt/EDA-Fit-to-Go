// HomePage (SSR: fetches posts server-side)

import PostList from './PostList';

interface Post {
  id: number;
  title: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  try {
    // Fetch data from the backend Spring Boot app
    const response = await fetch('http://spring-app:8080/api/post/all');
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching posts", error);
    return [];
  }
};

const HomePage = async () => {
  // SSR - Fetch posts when the page is rendered on the server
  const posts = await fetchPosts();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Pass the fetched posts to the PostList client component */}
      <PostList posts={posts} />
    </main>
  );
};

export default HomePage;
