import { NextRequest, NextResponse } from 'next/server';
import { parseHtml, analyzeActivities, getDateRange } from '@/lib/analyzer';

// Store analysis result in memory (in production, use a proper store)
let analysisCache: ReturnType<typeof analyzeActivities> | null = null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 100MB limit' },
        { status: 400 }
      );
    }
    
    const htmlContent = await file.text();
    const activities = parseHtml(htmlContent);
    
    if (activities.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No activities found in file. Please upload a valid YouTube activity HTML file.' },
        { status: 400 }
      );
    }
    
    const result = analyzeActivities(activities);
    analysisCache = result;
    
    const dateRange = getDateRange(activities);
    const uniqueChannels = new Set(activities.filter(a => a.channel).map(a => a.channel));
    const uniqueVideos = new Set(activities.filter(a => a.video_id).map(a => a.video_id));
    
    return NextResponse.json({
      success: true,
      stats: {
        total_watched: result.totalWatched,
        total_searches: result.totalSearches,
        unique_videos: uniqueVideos.size,
        unique_channels: uniqueChannels.size,
        date_range: dateRange,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!analysisCache) {
    return NextResponse.json(
      { success: false, message: 'No data available. Please upload a file first.' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: analysisCache,
  });
}

// Export cache for other routes
export { analysisCache };
