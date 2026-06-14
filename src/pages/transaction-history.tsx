import React, { useState, useEffect, useCallback } from 'react';
import { Page, Box, Text, Header } from 'zmp-ui';
import { api } from '@/services/api';
import type { APITimelineItem } from '@/stores/member-store';

import bg from '@/static/bg.svg';

const ITEMS_PER_PAGE = 10;

const formatVND = (amount: number) => {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return (amount / 1000).toFixed(0) + 'K';
  return amount.toString();
};

const formatDateDayMonth = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
};

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function TransactionHistoryPage() {
  const [items, setItems] = useState<APITimelineItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPage = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/v1/members/me/timeline', {
        params: { page, limit: ITEMS_PER_PAGE },
      });
      setItems(response.data.data || []);
      setMeta(response.data.meta || null);
      setCurrentPage(page);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử giao dịch:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (meta && page > meta.totalPages)) return;
    fetchPage(page);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers to display
  const getPageNumbers = (): (number | '...')[] => {
    if (!meta || meta.totalPages <= 1) return [];
    const { totalPages } = meta;
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Page className="page page-content relative min-h-screen bg-cream dark:bg-dark-bg">
      {/* Background decoration */}
      <Box
        className="absolute top-0 left-0 right-0 h-[320px] bg-cover bg-bottom opacity-[0.06] dark:opacity-[0.03] z-0 pointer-events-none"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <Header title="Lịch sử giao dịch" showBackIcon />

      <Box className="relative z-10 w-full max-w-md mx-auto px-4 pt-2 pb-8">
        {/* Loading skeleton */}
        {isLoading && (
          <Box className="space-y-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                className="animate-pulse bg-white dark:bg-dark-card h-[72px] rounded-xl border border-black/[0.03] dark:border-dark-border"
              />
            ))}
          </Box>
        )}

        {/* Empty state */}
        {!isLoading && items.length === 0 && (
          <Box className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border text-center mt-4">
            <Text className="text-3xl mb-3">📋</Text>
            <Text className="text-sm font-semibold text-text-main dark:text-dark-text mb-1">
              Chưa có giao dịch
            </Text>
            <Text className="text-xs text-text-muted dark:text-dark-muted">
              Lịch sử giao dịch sẽ hiện ở đây
            </Text>
          </Box>
        )}

        {/* Timeline items */}
        {!isLoading && items.length > 0 && (
          <Box className="mt-2">
            <Box className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-soft border border-black/[0.03] dark:border-dark-border">
              <Box className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-[9px] top-2 bottom-4 w-[2px] bg-primary/10 dark:bg-primary/5 z-0 rounded-full" />

                {items.map((item, index) => {
                  if (item.type === 'personal_bill') {
                    return (
                      <Box
                        key={item.id}
                        className="relative z-10 mb-4 last:mb-0 animate-slide-up"
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        <Box className="absolute -left-[18px] top-3 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-dark-surface z-10 shadow-sm" />
                        <Box className="bg-cream/60 dark:bg-dark-card p-3.5 rounded-xl border border-black/[0.02] dark:border-dark-border">
                          <Box className="flex justify-between items-start">
                            <Box className="flex-1 min-w-0 mr-3">
                              <Text className="text-sm font-semibold text-text-main dark:text-dark-text truncate">
                                {item.title}
                              </Text>
                              <Text className="text-xs text-text-muted dark:text-dark-muted mt-0.5">
                                {formatDateDayMonth(item.date)}
                              </Text>
                            </Box>
                            <Box className="text-right shrink-0">
                              <Text className="text-sm font-bold text-text-main dark:text-dark-text">
                                {formatVND(item.amount || 0)}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }

                  if (item.type === 'referral_bonus') {
                    return (
                      <Box
                        key={item.id}
                        className="relative z-10 mb-4 last:mb-0 animate-slide-up"
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        <Box className="absolute -left-[18px] top-3 w-3 h-3 rounded-full bg-success ring-4 ring-white dark:ring-dark-surface z-10 shadow-sm" />
                        <Box className="bg-success-light/60 dark:bg-success/5 p-3.5 rounded-xl border border-success/10">
                          <Box className="flex justify-between items-start">
                            <Box className="flex-1 min-w-0 mr-3">
                              <Text className="text-sm font-semibold text-text-main dark:text-dark-text truncate">
                                {item.title}
                              </Text>
                              <Text className="text-xs text-success/80 mt-0.5">
                                Hoa hồng giới thiệu · {formatDateDayMonth(item.date)}
                              </Text>
                            </Box>
                            <Box className="text-right shrink-0">
                              <Text className="text-sm font-bold text-success">
                                +{item.points} điểm
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }

                  return null;
                })}
              </Box>
            </Box>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <Box className="flex items-center justify-center gap-1.5 mt-5">
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${currentPage <= 1
                      ? 'text-text-muted/30 dark:text-dark-muted/30 cursor-not-allowed'
                      : 'text-text-main dark:text-dark-text bg-white dark:bg-dark-card border border-black/[0.06] dark:border-dark-border active:scale-95 shadow-sm'
                    }`}
                >
                  ‹
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <Text key={`dots-${i}`} className="text-xs text-text-muted dark:text-dark-muted px-1">
                      ···
                    </Text>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all active:scale-95
                        ${currentPage === p
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'text-text-main dark:text-dark-text bg-white dark:bg-dark-card border border-black/[0.06] dark:border-dark-border shadow-sm'
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!meta || currentPage >= meta.totalPages}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                    ${!meta || currentPage >= meta.totalPages
                      ? 'text-text-muted/30 dark:text-dark-muted/30 cursor-not-allowed'
                      : 'text-text-main dark:text-dark-text bg-white dark:bg-dark-card border border-black/[0.06] dark:border-dark-border active:scale-95 shadow-sm'
                    }`}
                >
                  ›
                </button>
              </Box>
            )}

            {/* Page info */}
            {meta && meta.totalPages > 1 && (
              <Text className="text-[11px] text-text-muted dark:text-dark-muted text-center mt-2">
                Trang {currentPage}/{meta.totalPages} · {meta.total} giao dịch
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
}

export default TransactionHistoryPage;
