'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowAction?: (action: string, item: T) => void;
  rowActions?: { label: string; value: string; variant?: 'default' | 'destructive' }[];
  emptyMessage?: string;
}

export function AdminTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowAction,
  rowActions = [],
  emptyMessage = 'No data found',
}: AdminTableProps<T>) {
  const getValue = (item: T, key: string): React.ReactNode => {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value as React.ReactNode;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {onSearchChange && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10 bg-background/50 border-border/50 focus:border-neon-purple"
            />
          </div>
          <Button variant="outline" className="border-border/50 hover:border-neon-purple">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="cyber-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-semibold text-foreground',
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                {rowActions.length > 0 && (
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} className="p-8">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
                      <span className="ml-3 text-muted-foreground">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} className="p-8">
                    <div className="text-center text-muted-foreground">{emptyMessage}</div>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <motion.tr
                    key={item.id ?? index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn('px-4 py-3 text-sm', column.className)}
                      >
                        {column.render
                          ? column.render(item)
                          : getValue(item, String(column.key))}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            {rowActions.map((action) => (
                              <DropdownMenuItem
                                key={action.value}
                                onClick={() => onRowAction?.(action.value, item)}
                                className={cn(
                                  'cursor-pointer',
                                  action.variant === 'destructive' && 'text-red-400 focus:text-red-400'
                                )}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="border-border/50 hover:border-neon-purple"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="border-border/50 hover:border-neon-purple"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
