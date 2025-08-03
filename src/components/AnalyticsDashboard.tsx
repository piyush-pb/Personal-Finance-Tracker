"use client";

import { useState, useEffect } from 'react';
import { PostHog } from './PostHogProvider';

export default function AnalyticsDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    transactions: 0,
    budgets: 0,
    lastEvent: null
  });

  useEffect(() => {
    // Simulate analytics data updates
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        pageViews: prev.pageViews + Math.floor(Math.random() * 3),
        transactions: prev.transactions + Math.floor(Math.random() * 2),
        budgets: prev.budgets + Math.floor(Math.random() * 1),
        lastEvent: new Date().toLocaleTimeString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAnalytics = () => {
    PostHog.capture('analytics_toggled', {
      action: isVisible ? 'hide_analytics' : 'show_analytics',
      timestamp: new Date().toISOString(),
    });
    setIsVisible(!isVisible);
  };

  const handleExportData = () => {
    PostHog.capture('data_exported', {
      action: 'export_analytics',
      timestamp: new Date().toISOString(),
    });
    alert('Analytics data exported! (Demo)');
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggleAnalytics}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          📊 Show Analytics
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📊 PostHog Analytics
        </h3>
        <button
          onClick={handleToggleAnalytics}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Page Views:</span>
          <span className="font-semibold text-blue-600">{analyticsData.pageViews}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Transactions:</span>
          <span className="font-semibold text-green-600">{analyticsData.transactions}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Budget Updates:</span>
          <span className="font-semibold text-purple-600">{analyticsData.budgets}</span>
        </div>
        
        {analyticsData.lastEvent && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Last event: {analyticsData.lastEvent}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-zinc-700">
        <button
          onClick={handleExportData}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
        >
          Export Data
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Powered by PostHog
      </div>
    </div>
  );
} 