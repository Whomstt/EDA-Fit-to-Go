import { Post } from '../types/Post';


export const updatePostLike = (post: Post, liked: boolean): Post => ({
  ...post,
  liked,
  likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
});

export const revertPostLike = (post: Post, liked: boolean): Post =>
  updatePostLike(post, !liked);


export const handleCommentAction = (post: Post): Post => ({
  ...post,
  commentCount: post.commentCount + 1,
});


export const handleShareAction = (post: Post): Post => {
  const updatedPost = {
    ...post,
    shareCount: post.shareCount + 1,
  };

  const shareLink = `${window.location.origin}/CS4227-Fit-to-Go/post/${post.id}`;

  // Try to copy the link to the clipboard
  navigator.clipboard.writeText(shareLink)
    .then(() => {
      alert('Link copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy link');
    });

  return updatedPost;
};
