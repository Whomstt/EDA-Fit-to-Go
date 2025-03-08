export interface Post {
    id: number;
    title: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    // "liked" is temporary (client-side only) and resets to false on page load.
    liked?: boolean;
  }
  