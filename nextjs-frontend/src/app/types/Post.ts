export interface Post {
    id: number;
    title: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    liked?: boolean;
  }
  