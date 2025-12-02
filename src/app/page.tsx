'use client';

import { useAppStore } from '@/store/useAppStore';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import ActivityTable from '@/components/ActivityTable';
import SearchTab from '@/components/SearchTab';
import ExportTab from '@/components/ExportTab';

export default function Home() {
  const { analysisResult, activeTab, setActiveTab } = useAppStore();

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'activities', label: 'Hoạt động', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )},
    { id: 'search', label: 'Tìm kiếm', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { id: 'export', label: 'Xuất dữ liệu', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    )},
  ] as const;

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <FileUpload />

      {/* Content Section */}
      {analysisResult && (
        <div className="space-y-4 sm:space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-1.5 sm:p-2 flex flex-wrap gap-1 sm:gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'activities' && <ActivityTable />}
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'export' && <ExportTab />}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysisResult && (
        <div className="text-center py-8 sm:py-12">
          <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Chưa có dữ liệu</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
            Upload file lịch sử xem YouTube từ Google Takeout để bắt đầu phân tích
          </p>
        </div>
      )}
    </div>
  );
}
