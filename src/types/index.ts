export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    medium: string;
    high: string;
    maxres?: string;
  };
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  categoryId?: string;
  playlistId?: string;
  playlistTitle?: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  videoIds: string[];
  order: number;
}

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
  thumbnail: string;
  banner?: string;
  email: string;
}

export interface SponsorTier {
  name: string;
  icon: string;
  features: string[];
  highlighted?: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'popular' | 'mostLiked';
export type ViewMode = 'grid' | 'list';
