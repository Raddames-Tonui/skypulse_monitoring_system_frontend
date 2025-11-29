import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

export interface SortRule {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterRule {
  column: string;
  value: any;
}

interface TableOptions {
  FILTER_MAP?: Record<string, string>;
  SORT_MAP?: Record<string, string>;
}

export function useTableParams(options?: TableOptions) {
  const { FILTER_MAP = {}, SORT_MAP = {} } = options ?? {};
  const navigate = useNavigate();

  const search = useSearch({ strict: false });

  const searchParams = useMemo(() => {
    return new URLSearchParams(
      Object.entries(search).reduce((acc, [k, v]) => {
        if (v != null) acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    );
  }, [search]);

  // ---------- Initialization ----------
  const initialSort: SortRule[] = searchParams.get('sort')
    ? searchParams
        .get('sort')!
        .split(',')
        .filter(Boolean)
        .map((s) => {
          const [key, dir = 'asc'] = s.split(':');
          const col = Object.keys(SORT_MAP).find((k) => SORT_MAP[k] === key);
          return {
            column: (col ?? key) as string,
            direction: dir as 'asc' | 'desc',
          };
        })
    : [];

  const initialPage = Number(searchParams.get('page')) || 1;
  const initialPageSize = Number(searchParams.get('pageSize')) || 10;

  const [sortBy, setSortBy] = useState<SortRule[]>(initialSort);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // ---------- Query param builder ----------
  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, pageSize };

    // filters
    filters.forEach((f) => {
      if (f.value) params[FILTER_MAP[f.column] ?? f.column] = f.value;
    });

    // sorting
    if (sortBy.length) {
      params.sort = sortBy
        .map((r) => `${SORT_MAP[r.column] ?? r.column}:${r.direction}`)
        .join(',');
    }

    return params;
  }, [page, pageSize, filters, sortBy, FILTER_MAP, SORT_MAP]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    queryParams,
    navigate,
  };
}