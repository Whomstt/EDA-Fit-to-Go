import PostList from './components/PostList';

const HomePage = async () => {
  const mockPosts = [
    { id: 1, title: "Mock Post 1", likeCount: 5, commentCount: 6, shareCount: 1 },
    { id: 2, title: "Mock Post 2", likeCount: 3, commentCount: 4, shareCount: 8 },
    { id: 3, title: "Mock Post 3", likeCount: 7, commentCount: 2, shareCount: 3 },
  ];

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
