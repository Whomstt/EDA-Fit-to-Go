import { Post } from '../types/Post';


export const updatePostLike = (post: Post, liked: boolean): Post => ({
  ...post,
  liked,
  likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
});

export const revertPostLike = (post: Post, liked: boolean): Post =>
  updatePostLike(post, !liked);

export const handleCommentAction = (id: number): void => {
  console.log(`Comment button clicked for post ${id}`);
};

export const handleShareAction = (id: number): void => {
  const shareLink = `${window.location.origin}/post/${id}`;
  alert(`Share link: ${shareLink}`);
};
