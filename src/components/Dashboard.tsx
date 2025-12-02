'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAppStore } from '@/store/useAppStore';

Chart.register(...registerables);

export default function Dashboard() {
  const { analysisResult } = useAppStore();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!analysisResult || !chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const hours = Object.keys(analysisResult.hourlyStats).sort();
    const values = hours.map(h => analysisResult.hourlyStats[h]);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: hours.map(h => `${h}:00`),
        datasets: [{
          label: 'Lượt xem theo giờ',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              precision: 0,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [analysisResult]);

  if (!analysisResult) return null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-gray-800">{analysisResult.totalWatched.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-500">Video đã xem</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-gray-800">{analysisResult.totalSearches.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-500">Lượt tìm kiếm</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-gray-800">{analysisResult.topChannels.length.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-500">Kênh đã xem</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-gray-800">{analysisResult.topVideos.length > 0 ? analysisResult.topVideos[0].count : 0}</p>
            <p className="text-xs sm:text-sm text-gray-500">Lượt xem cao nhất</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Thống kê theo giờ</h3>
        <div className="h-[200px] sm:h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Videos */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Top Video
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {analysisResult.topVideos.slice(0, 5).map((video, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2 transition-colors"
                  >
                    {video.title}
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">{video.channel}</p>
                </div>
                <span className="flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  {video.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Channels */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Top Kênh
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {analysisResult.topChannels.slice(0, 5).map((channel, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  {index + 1}
                </span>
                <span className="flex-1 text-xs sm:text-sm font-medium text-gray-800 truncate">
                  {channel.name}
                </span>
                <span className="flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  {channel.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Searches */}
        {analysisResult.topSearches.length > 0 && (
          <div className="card lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Top Tìm kiếm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {analysisResult.topSearches.slice(0, 10).map((search, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-xs sm:text-sm font-medium text-gray-800 truncate">
                    {search.query}
                  </span>
                  <span className="flex-shrink-0 px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                    {search.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
