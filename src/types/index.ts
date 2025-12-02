// Types for YouTube Activity Analyzer

export interface Activity {
  type: 'watch' | 'search';
  title: string;
  link: string;
  channel: string;
  channel_link: string;
  time: string;
  video_id: string;
}

export interface VideoStats {
  count: number;
  title: string;
  channel: string;
  link: string;
}

export interface AnalysisResult {
  activities: Activity[];
  totalWatched: number;
  totalSearches: number;
  topVideos: Array<{ title: string; count: number; channel: string; link: string }>;
  topChannels: Array<{ name: string; count: number }>;
  topSearches: Array<{ query: string; count: number }>;
  hourlyStats: Record<string, number>;
  dailyStats: Record<string, number>;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  stats?: {
    total_watched: number;
    total_searches: number;
    unique_videos: number;
    unique_channels: number;
    date_range: { start: string; end: string };
  };
}
