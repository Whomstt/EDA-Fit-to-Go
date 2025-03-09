import PostList from './components/PostList';
import { mockPosts } from './lib/mockPosts';

const HomePage = async () => {
  let posts = mockPosts; // Default to mock posts

  try {

    const response = await fetch('http://spring-app:8080/api/post/all');
    if (response.ok) {
      posts = await response.json();
    } else {
      console.error('Failed to fetch posts from backend, using mock data.');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <PostList posts={posts} />
    </main>
  );
};

export default HomePage;
