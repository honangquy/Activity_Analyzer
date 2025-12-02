'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ActivityTable() {
  const { analysisResult } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'watch' | 'search'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 20;

  const filteredActivities = useMemo(() => {
    if (!analysisResult) return [];

    let activities = analysisResult.activities;

    // Apply type filter
    if (filter !== 'all') {
      activities = activities.filter(a => a.type === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      activities = activities.filter(
        a => a.title.toLowerCase().includes(query) || a.channel.toLowerCase().includes(query)
      );
    }

    return activities;
  }, [analysisResult, filter, searchQuery]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!analysisResult) return null;

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả ({analysisResult.activities.length})
          </button>
          <button
            onClick={() => { setFilter('watch'); setCurrentPage(1); }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'watch' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Video ({analysisResult.totalWatched})
          </button>
          <button
            onClick={() => { setFilter('search'); setCurrentPage(1); }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tìm kiếm ({analysisResult.totalSearches})
          </button>
        </div>

        {/* Search Box */}
        <div className="flex-1 w-full sm:min-w-[200px]">
          <div className="relative">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm trong hoạt động..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Hiển thị {paginatedActivities.length} / {filteredActivities.length} hoạt động
      </p>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="w-20">Loại</th>
              <th>Tiêu đề</th>
              <th className="w-48">Kênh</th>
              <th className="w-48">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities.map((activity, index) => (
              <tr key={index}>
                <td>
                  {activity.type === 'watch' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Video
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Tìm kiếm
                    </span>
                  )}
                </td>
                <td>
                  {activity.link ? (
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline line-clamp-2"
                    >
                      {activity.title}
                    </a>
                  ) : (
                    <span className="line-clamp-2">{activity.title}</span>
                  )}
                </td>
                <td className="text-gray-600 truncate">{activity.channel || '-'}</td>
                <td className="text-gray-500 text-sm">{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="px-4 py-2 text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
