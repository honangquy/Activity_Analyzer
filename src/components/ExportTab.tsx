'use client';

import { useAppStore } from '@/store/useAppStore';
import { exportToJson, exportToCsv } from '@/lib/analyzer';

export default function ExportTab() {
  const { analysisResult } = useAppStore();

  if (!analysisResult) return null;

  const handleExportJson = () => {
    const json = exportToJson(analysisResult);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-activity-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const csv = exportToCsv(analysisResult.activities);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-activities.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="card">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Xuất dữ liệu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Export JSON */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-800">JSON</h4>
                <p className="text-xs sm:text-sm text-gray-500">Dữ liệu đầy đủ với thống kê</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Xuất toàn bộ dữ liệu phân tích bao gồm thống kê, top video, top kênh và tất cả hoạt động dưới dạng JSON.
            </p>
            <button onClick={handleExportJson} className="btn-primary w-full">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải xuống JSON
              </span>
            </button>
          </div>

          {/* Export CSV */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-green-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-800">CSV</h4>
                <p className="text-xs sm:text-sm text-gray-500">Dùng với Excel/Sheets</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Xuất danh sách hoạt động dưới dạng CSV để mở trong Excel, Google Sheets hoặc các công cụ phân tích khác.
            </p>
            <button onClick={handleExportCsv} className="btn-primary w-full bg-green-600 hover:bg-green-700">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải xuống CSV
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Preview */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Xem trước dữ liệu</h3>
        <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto -mx-4 sm:mx-0">
          <pre className="text-xs sm:text-sm text-green-400 whitespace-pre-wrap">
            {JSON.stringify(
              {
                totalWatched: analysisResult.totalWatched,
                totalSearches: analysisResult.totalSearches,
                topVideos: analysisResult.topVideos.slice(0, 3),
                topChannels: analysisResult.topChannels.slice(0, 3),
                '...': 'more data'
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
