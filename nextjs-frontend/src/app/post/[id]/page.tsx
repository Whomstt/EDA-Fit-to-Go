import PostDetail from '../../components/PostDetail';

// Generate static paths for posts with IDs "1", "2", and "3"
export async function generateStaticParams() {
  return [
    { id: "1" }, 
    { id: "2" }, 
    { id: "3" }
  ];
}

// The page component receives the dynamic parameters and needs to await them
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before using them
  const resolvedParams = await params;
  return <PostDetail id={resolvedParams.id} />;
}