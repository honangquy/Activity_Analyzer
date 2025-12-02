import { Activity, AnalysisResult, VideoStats } from '@/types';

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Pattern: youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v') || '';
    }
    
    // Pattern: youtube.com/shorts/VIDEO_ID
    if (urlObj.pathname.startsWith('/shorts/')) {
      return urlObj.pathname.split('/shorts/')[1] || '';
    }
    
    // Pattern: youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch {
    // Fallback regex patterns
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return watchMatch[1];
    
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
  }
  
  return '';
}

/**
 * Parse YouTube activity HTML from Google Takeout
 */
export function parseHtml(htmlContent: string): Activity[] {
  const activities: Activity[] = [];
  
  // Pattern for watched videos (Vietnamese format)
  // Format: Đã xem <a href="URL">Title</a><br><a href="channel_url">Channel</a><br>Timestamp
  // Timestamp format: 15:59:26 21 thg 10, 2025
  const watchPattern = /Đã xem\s*<a href="([^"]+)">([^<]+)<\/a><br>(?:<a href="[^"]+">([^<]*?)<\/a><br>)?(\d{1,2}:\d{2}:\d{2}\s+\d{1,2}\s+thg\s+\d{1,2},\s+\d{4})/gi;
  
  // Pattern for search queries (Vietnamese format)
  // Format: Đã tìm kiếm <a href="URL">Query</a><br>Timestamp
  const searchPattern = /Đã tìm kiếm\s*<a href="([^"]+)">([^<]+)<\/a><br>(\d{1,2}:\d{2}:\d{2}\s+\d{1,2}\s+thg\s+\d{1,2},\s+\d{4})/gi;
  
  // Parse watched videos
  let match;
  while ((match = watchPattern.exec(htmlContent)) !== null) {
    const link = match[1] || '';
    const title = match[2] || '';
    const channel = match[3] || '';
    const time = match[4]?.trim() || '';
    const videoId = extractVideoId(link);
    
    if (title && link) {
      activities.push({
        type: 'watch',
        title: title.trim(),
        link,
        channel: channel.trim(),
        channel_link: '',
        time,
        video_id: videoId,
      });
    }
  }
  
  // Parse search queries
  while ((match = searchPattern.exec(htmlContent)) !== null) {
    const link = match[1] || '';
    const query = match[2] || '';
    const time = match[3]?.trim() || '';
    
    if (query) {
      activities.push({
        type: 'search',
        title: query.trim(),
        link,
        channel: '',
        channel_link: '',
        time,
        video_id: '',
      });
    }
  }
  
  return activities;
}

/**
 * Analyze activities and generate statistics
 */
export function analyzeActivities(activities: Activity[]): AnalysisResult {
  const watchedVideos = activities.filter(a => a.type === 'watch');
  const searches = activities.filter(a => a.type === 'search');
  
  // Count videos by video_id (not title) for accuracy
  const videoStats: Record<string, VideoStats> = {};
  for (const activity of watchedVideos) {
    const key = activity.video_id || activity.title; // fallback to title if no video_id
    if (!videoStats[key]) {
      videoStats[key] = {
        count: 0,
        title: activity.title,
        channel: activity.channel,
        link: activity.link,
      };
    }
    videoStats[key].count++;
  }
  
  // Get top videos
  const topVideos = Object.values(videoStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(v => ({
      title: v.title,
      count: v.count,
      channel: v.channel,
      link: v.link,
    }));
  
  // Count channels
  const channelCounts: Record<string, number> = {};
  for (const activity of watchedVideos) {
    if (activity.channel) {
      channelCounts[activity.channel] = (channelCounts[activity.channel] || 0) + 1;
    }
  }
  
  const topChannels = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
  
  // Count search queries
  const searchCounts: Record<string, number> = {};
  for (const activity of searches) {
    searchCounts[activity.title] = (searchCounts[activity.title] || 0) + 1;
  }
  
  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));
  
  // Hourly statistics
  const hourlyStats: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    hourlyStats[i.toString().padStart(2, '0')] = 0;
  }
  
  // Daily statistics
  const dailyStats: Record<string, number> = {};
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (const day of days) {
    dailyStats[day] = 0;
  }
  
  // Parse timestamps and count
  for (const activity of watchedVideos) {
    if (activity.time) {
      // Try to parse Vietnamese date format
      const hourMatch = activity.time.match(/(\d{1,2}):(\d{2})/);
      if (hourMatch) {
        const hour = hourMatch[1].padStart(2, '0');
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      }
      
      // Parse day of week
      const dayMatch = activity.time.match(/\b(CN|T[2-7])\b/i);
      if (dayMatch) {
        const day = dayMatch[1].toUpperCase();
        if (day === 'CN' || /^T[2-7]$/.test(day)) {
          dailyStats[day] = (dailyStats[day] || 0) + 1;
        }
      }
    }
  }
  
  return {
    activities,
    totalWatched: watchedVideos.length,
    totalSearches: searches.length,
    topVideos,
    topChannels,
    topSearches,
    hourlyStats,
    dailyStats,
  };
}

/**
 * Get date range from activities
 */
export function getDateRange(activities: Activity[]): { start: string; end: string } {
  const times = activities
    .map(a => a.time)
    .filter(t => t && t.length > 0);
  
  if (times.length === 0) {
    return { start: 'N/A', end: 'N/A' };
  }
  
  return {
    start: times[times.length - 1] || 'N/A',
    end: times[0] || 'N/A',
  };
}

/**
 * Export data to JSON
 */
export function exportToJson(result: AnalysisResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Export activities to CSV
 */
export function exportToCsv(activities: Activity[]): string {
  const headers = ['Type', 'Title', 'Link', 'Channel', 'Time'];
  const rows = activities.map(a => [
    a.type,
    `"${a.title.replace(/"/g, '""')}"`,
    a.link,
    `"${a.channel.replace(/"/g, '""')}"`,
    `"${a.time.replace(/"/g, '""')}"`,
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
