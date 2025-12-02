'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function SearchTab() {
  const { analysisResult } = useAppStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!analysisResult || !query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return analysisResult.activities
      .filter(
        a =>
          a.title.toLowerCase().includes(searchTerm) ||
          a.channel.toLowerCase().includes(searchTerm)
      )
      .slice(0, 50); // Limit results
  }, [analysisResult, query]);

  if (!analysisResult) return null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Search Box */}
      <div className="card">
        <div className="relative max-w-xl mx-auto">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm video hoặc kênh..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Results */}
      {query && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Tìm thấy {searchResults.length} kết quả cho "{query}"
          </p>

          {searchResults.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {searchResults.map((activity, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      {activity.type === 'watch' ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={activity.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-lg font-medium text-gray-800 hover:text-blue-600 line-clamp-2 transition-colors"
                      >
                        {activity.title}
                      </a>
                      {activity.channel && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">{activity.channel}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2">{activity.time}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
                      activity.type === 'watch' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type === 'watch' ? 'Video' : 'Tìm kiếm'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 sm:py-12">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm sm:text-base text-gray-500">Không tìm thấy kết quả nào</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="card text-center py-8 sm:py-12">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm sm:text-base text-gray-500">Nhập từ khóa để tìm kiếm video hoặc kênh</p>
        </div>
      )}
    </div>
  );
}
