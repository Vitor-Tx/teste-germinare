'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TransactionState, Filters } from '@/lib/types';
import { subDays, format } from 'date-fns';

const now = new Date();
export const useTransactions = create<TransactionState>()(
  persist(
    (set) => ({
      loading: true,
      setLoading: (loading) => set((state) => ({ loading: loading })),
      transactions: [],
      setTransactions: (transactions) => set((state) => ({ transactions: transactions })),
      pendingSum: 0,
      setPendingSum: (sum) => set((state) => ({ pendingSum: sum })),
      totalDeposits: 0,
      setTotalDeposits: (sum) => set((state) => ({ totalDeposits: sum })),
      totalWithdraws: 0,
      setTotalWithdraws: (sum) => set((state) => ({ totalWithdraws: sum })),
      dateRange: {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: now,
      },
      setDateRange: (range) => set((state) => ({ dateRange: range })),
      currency: 'BRL',
      setCurrency: (currency) => set((state) => ({ currency: currency })),
      industry: 'All',
      setIndustry: (industry) => set((state) => ({ industry: industry })),
    }),
    {
      partialize: (state) => ({
        transactions: state.transactions,
        pendingSum: state.pendingSum,
        totalDeposits: state.totalDeposits,
        totalWithdraws: state.totalWithdraws,
        dateRange: state.dateRange,
        currency: state.currency,
        industry: state.industry,
      }),
      name: 'filter-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);