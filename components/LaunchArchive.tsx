
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Triangle, MessageSquare, Rocket, Calendar, ChevronDown } from 'lucide-react';
import { Product, View } from '../types';
import { supabase } from '../lib/supabase';
import SafeImage from './SafeImage';
import { slugify } from '../utils/searchUtils';
import ProductCardSkeleton from './ProductCardSkeleton';

interface LaunchArchiveProps {
  products: Product[];
  initialDate?: string; // YYYY/M/D format
  setView: (view: View, path?: string) => void;
  onProductClick: (product: Product) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
}

type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly';
type FilterMode = 'featured' | 'all';

const LaunchArchive: React.FC<LaunchArchiveProps> = ({
  products,
  initialDate,
  setView,
  onProductClick,
  onUpvote,
  hasUpvoted
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      const parts = initialDate.split('/');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return new Date();
  });
  const [expandedYear, setExpandedYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  // Generate days for the calendar strip
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedDate]);

  // Get the current day of month
  const currentDay = selectedDate.getDate();

  // Filter products by selected date
  const filteredProducts = useMemo(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    let endDate = new Date(selectedDate);

    if (viewMode === 'daily') {
      endDate.setHours(23, 59, 59, 999);
    } else if (viewMode === 'weekly') {
      endDate = new Date(startOfDay);
      endDate.setDate(endDate.getDate() + 7);
    } else if (viewMode === 'monthly') {
      endDate = new Date(startOfDay.getFullYear(), startOfDay.getMonth() + 1, 0, 23, 59, 59, 999);
      startOfDay.setDate(1);
    } else if (viewMode === 'yearly') {
      startOfDay.setMonth(0, 1);
      endDate = new Date(startOfDay.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    return products
      .filter(p => {
        const productDate = new Date(p.created_at);
        return productDate >= startOfDay && productDate <= endDate;
      })
      .sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
  }, [products, selectedDate, viewMode]);

  // Generate years for the sidebar (2020 to current year)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);
  }, []);

  // Months for the sidebar
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format date for display
  const formatDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };

    if (viewMode === 'daily') {
      return `Best of ${selectedDate.toLocaleDateString('en-US', options)}`;
    } else if (viewMode === 'weekly') {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);
      return `Best of Week ${Math.ceil(selectedDate.getDate() / 7)}, ${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else if (viewMode === 'monthly') {
      return `Best of ${selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    } else {
      return `Best of ${selectedDate.getFullYear()}`;
    }
  };

  // Navigate date
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'monthly') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }

    // Don't allow future dates
    if (newDate > new Date()) return;

    setSelectedDate(newDate);
    updateUrl(newDate);
  };

  // Update URL when date changes
  const updateUrl = (date: Date) => {
    const path = `/leaderboard/daily/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    setView(View.LAUNCH_ARCHIVE, path);
  };

  // Select a specific day from calendar
  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);

    // Don't allow future dates
    if (newDate > new Date()) return;

    setSelectedDate(newDate);
    updateUrl(newDate);
  };

  // Select month from sidebar
  const selectMonth = (year: number, monthIndex: number) => {
    const newDate = new Date(year, monthIndex, 1);

    // Don't allow future dates
    if (newDate > new Date()) return;

    setSelectedDate(newDate);
    updateUrl(newDate);
  };

  // Check if a day is in the future
  const isFutureDay = (day: number) => {
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return checkDate > new Date();
  };

  // Check if current month/year matches selected
  const isCurrentMonth = (monthIndex: number) => {
    return selectedDate.getMonth() === monthIndex && selectedDate.getFullYear() === expandedYear;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Rocket className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Launch Archive</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary mb-4">
              {formatDateTitle()}
            </h1>

            {/* View Mode Tabs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-6">
              <div className="flex items-center gap-1 sm:gap-2 border-b-2 border-transparent">
                {(['daily', 'weekly', 'monthly', 'yearly'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold capitalize transition-all border-b-2 -mb-[2px] ${
                      viewMode === mode
                        ? 'text-primary border-primary'
                        : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {(['featured', 'all'] as FilterMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold capitalize rounded-lg transition-all ${
                      filterMode === mode
                        ? 'text-primary bg-primary-light'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Strip */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              <button
                onClick={() => navigateDate('prev')}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all shrink-0"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>

              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 sm:gap-1.5 py-2">
                  {calendarDays.map((day) => {
                    const isSelected = day === currentDay;
                    const isFuture = isFutureDay(day);

                    return (
                      <button
                        key={day}
                        onClick={() => !isFuture && selectDay(day)}
                        disabled={isFuture}
                        className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-primary text-white shadow-lg'
                            : isFuture
                            ? 'text-gray-200 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-primary-light hover:text-primary'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => navigateDate('next')}
                disabled={selectedDate >= new Date()}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <>
                {[1, 2, 3, 4, 5].map(i => <ProductCardSkeleton key={i} />)}
              </>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 sm:p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No launches found</h3>
                <p className="text-sm text-gray-500">There were no product launches on this date.</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => {
                const isUpvoted = hasUpvoted(product.id);
                const commentCount = product.comments?.length || 0;

                return (
                  <div
                    key={product.id}
                    className={`group flex items-center gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-primary-light/30 transition-all cursor-pointer ${
                      index === 0 ? 'bg-primary-light/20' : ''
                    } ${index !== filteredProducts.length - 1 ? 'border-b border-gray-50' : ''}`}
                    onClick={() => onProductClick(product)}
                  >
                    {/* Product Logo */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                      <SafeImage
                        src={product.logo_url}
                        alt={product.name}
                        seed={product.id}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {product.name}
                        </h3>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-primary text-white text-[9px] sm:text-[10px] font-black rounded uppercase tracking-wider shrink-0">
                            #1
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-1 mb-2">
                        {product.tagline}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle comment click
                        }}
                        className="flex flex-col items-center justify-center w-12 sm:w-14 h-14 sm:h-16 border border-gray-100 rounded-xl hover:border-primary-light hover:bg-white text-gray-400 hover:text-primary transition-all"
                      >
                        <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 mb-0.5" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-900">{commentCount}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvote(product.id);
                        }}
                        className={`flex flex-col items-center justify-center w-12 sm:w-14 h-14 sm:h-16 border rounded-xl transition-all ${
                          isUpvoted
                            ? 'bg-white border-primary text-primary shadow-sm'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                        }`}
                      >
                        <Triangle className={`w-4 sm:w-5 h-4 sm:h-5 mb-0.5 ${isUpvoted ? 'fill-primary' : ''}`} />
                        <span className="text-[10px] sm:text-xs font-bold">{product.upvotes_count || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar - Launch Archive Navigation */}
        <aside className="w-full lg:w-64 shrink-0 order-first lg:order-none">
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Launch Archive
            </h3>

            <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              {years.map((year) => (
                <div key={year}>
                  <button
                    onClick={() => setExpandedYear(expandedYear === year ? 0 : year)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      expandedYear === year
                        ? 'bg-primary-light text-primary'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {year}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedYear === year ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedYear === year && (
                    <div className="ml-2 mt-1 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                      {months.map((month, idx) => {
                        const isFutureMonth = new Date(year, idx, 1) > new Date();
                        const isSelected = isCurrentMonth(idx);

                        return (
                          <button
                            key={month}
                            onClick={() => !isFutureMonth && selectMonth(year, idx)}
                            disabled={isFutureMonth}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-primary text-white'
                                : isFutureMonth
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-primary hover:bg-primary-light/50'
                            }`}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LaunchArchive;
