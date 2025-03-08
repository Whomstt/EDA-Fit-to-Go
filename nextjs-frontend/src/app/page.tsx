import PostList from './PostList';


const HomePage = async () => {
  const response = await fetch('http://spring-app:8080/api/post/all');
  const posts = response.ok ? await response.json() : [];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <PostList posts={posts} />
    </main>
  );
};

export default HomePage;
