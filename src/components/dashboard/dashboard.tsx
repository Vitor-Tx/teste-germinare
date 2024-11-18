'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { SummaryCard } from '@/components/dashboard/stats/summary-card';
import { DataTable } from '@/components/dashboard/stats/data-table';
import { TransactionTrends } from '@/components/dashboard/stats/transaction-trends';
import { ExpenseBreakdown } from '@/components/dashboard/stats/expense-breakdown';
import { Wallet, ArrowUpIcon, ArrowDownIcon, Clock } from 'lucide-react';
import { useAuth } from '@/store/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactions } from '@/store/use-transactions';
import { subDays, format } from 'date-fns';
import { currencySymbols } from '@/lib/utils'
import { columns } from '@/components/dashboard/stats/columns';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardProps {
  initialTransactions: Transaction[];
  initialPendingSum: number;
  initialDeposits: number;
  initialWithdraws: number;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
async function fetchTransactions(url: string) {
  console.log(`making request to: ${url}`)
  const response = await fetch(`url`);
  return response.json();
}

export default function Dashboard({ initialTransactions, initialPendingSum, initialDeposits, initialWithdraws }: DashboardProps) {

  const setLoading = useTransactions((state) => state.setLoading);
  const loading = useTransactions((state) => state.loading);
  const setTransactions = useTransactions((state) => state.setTransactions);
  const transactions = useTransactions((state) => state.transactions);
  const setPendingSum = useTransactions((state) => state.setPendingSum);
  const pendingSum = useTransactions((state) => state.pendingSum);
  const setTotalDeposits = useTransactions((state) => state.setTotalDeposits);
  const totalDeposits = useTransactions((state) => state.totalDeposits);
  const setTotalWithdraws = useTransactions((state) => state.setTotalWithdraws);
  const totalWithdraws = useTransactions((state) => state.totalWithdraws);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.user);
  const dateRange = useTransactions((state) => state.dateRange);
  const currency = useTransactions((state) => state.currency);
  const industry = useTransactions((state) => state.industry);
  const queryTo = format(dateRange.to ?? Date.now(), "yyyy-MM-dd");
  const queryFrom = format(dateRange.from ?? subDays(queryTo, 30), "yyyy-MM-dd");
  const url = `${baseUrl}/transactions?from=${queryFrom}&to=${queryTo}&currency=${currency ?? "All"}&industry=${industry ?? "All"}`;
  const router = useRouter();
  const isMobile = useIsMobile()
  useEffect(() => {
    if (transactions.length === 0) {
      setLoading(true);
      console.log("length of transactions is 0.")
      console.log(transactions.length);
      console.log(transactions);
      setTransactions(initialTransactions);
      setPendingSum(initialPendingSum);
      setTotalDeposits(initialDeposits);
      setTotalWithdraws(initialWithdraws);
      setLoading(false);
    }

  }, [initialDeposits, initialPendingSum, initialTransactions, initialWithdraws, setLoading, setPendingSum, setTotalDeposits, setTotalWithdraws, setTransactions, transactions, transactions.length, url]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("not authenticated");
      router.push('/');
    }
    setLoading(false);
  }, [isAuthenticated, router, setLoading]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex h-screen">
        <main className="flex-1 p-8 bg-background overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-80 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>

            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard.</h1>
            <p className="text-muted-foreground mt-5">
              Welcome back, {user?.name ?? ""}! Here's an overview of your finances.
              <br />You can filter the data you want to see in the left sidebar.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Balance"
              value={`${currencySymbols[currency]} ${(totalDeposits - totalWithdraws).toFixed(2)}`}
              icon={<Wallet className="h-4 w-4" />}
              description="Your current balance across all accounts"
              trend={12.5}
            />
            <SummaryCard
              title="Income"
              value={`${currencySymbols[currency]} ${totalDeposits.toFixed(2)}`}
              icon={<ArrowUpIcon className="h-4 w-4" />}
              description="Total deposits this month"
              trend={8.2}
              className="hover:shadow-emerald-100"
            />
            <SummaryCard
              title="Expenses"
              value={`${currencySymbols[currency]} ${totalWithdraws.toFixed(2)}`}
              icon={<ArrowDownIcon className="h-4 w-4" />}
              description="Total withdrawals this month"
              trend={-5.1}
              className="hover:shadow-red-100"
            />
            <SummaryCard
              title="Pending"
              value={`${currencySymbols[currency]} ${pendingSum.toFixed(2)}`}
              icon={<Clock className="h-4 w-4" />}
              description="Transactions awaiting clearance"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <h2 className="text-xl font-semibold mb-4">Transation Stats</h2>
            {!isMobile ? (
              <>
                <TransactionTrends />
                {industry === "All"
                  ? (<ExpenseBreakdown />)
                  : ("")}
              </>)
              : (<p className="font-semibold mb-4">Check them on a larger device.</p>)}



          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            {!isMobile ? (<DataTable columns={columns} data={transactions} />)
              : (<p className="font-semibold mb-4">Check them on a larger device.</p>)}
          </div>
        </div>

      </main>
    </div>
  );
}