'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseHtml, analyzeActivities, getDateRange } from '@/lib/analyzer';

interface UploadStats {
  total_watched: number;
  total_searches: number;
  unique_videos: number;
  unique_channels: number;
  date_range: { start: string; end: string };
}

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const { setAnalysisResult, setLoading, setError, isLoading, error } = useAppStore();

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.html') && !file.name.endsWith('.txt')) {
      setError('Vui lòng upload file HTML hoặc TXT');
      return;
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('File quá lớn. Giới hạn 100MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Read file content directly in browser
      const htmlContent = await file.text();
      
      // Parse HTML
      const activities = parseHtml(htmlContent);
      
      if (activities.length === 0) {
        setError('Không tìm thấy hoạt động nào trong file. Vui lòng upload file lịch sử YouTube từ Google Takeout.');
        setLoading(false);
        return;
      }
      
      // Analyze
      const result = analyzeActivities(activities);
      
      // Calculate stats
      const dateRange = getDateRange(activities);
      const uniqueChannels = new Set(activities.filter(a => a.channel).map(a => a.channel));
      const uniqueVideos = new Set(activities.filter(a => a.video_id).map(a => a.video_id));
      
      setUploadStats({
        total_watched: result.totalWatched,
        total_searches: result.totalSearches,
        unique_videos: uniqueVideos.size,
        unique_channels: uniqueChannels.size,
        date_range: dateRange,
      });
      
      // Set analysis result to store
      setAnalysisResult(result);
      
    } catch (err) {
      setError('Lỗi khi xử lý file. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`upload-area ${isDragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm sm:text-base text-gray-600">Đang phân tích file...</p>
          </div>
        ) : (
          <>
            {/* Upload Icon */}
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1 sm:mb-2">
              Kéo thả file hoặc click để chọn
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-2">
              Hỗ trợ file HTML từ Google Takeout (tối đa 100MB)
            </p>
            <button className="btn-primary">
              Chọn file
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
          <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Stats Summary */}
      {uploadStats && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-green-700">Phân tích thành công!</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{uploadStats.total_watched.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-gray-500">Video đã xem</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{uploadStats.total_searches.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-gray-500">Lượt tìm kiếm</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{uploadStats.unique_videos.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-gray-500">Video khác nhau</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-gray-800">{uploadStats.unique_channels.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-gray-500">Kênh khác nhau</p>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200 text-center text-xs sm:text-sm text-gray-600">
            Khoảng thời gian: {uploadStats.date_range.start} - {uploadStats.date_range.end}
          </div>
        </div>
      )}
    </div>
  );
}
