'use client';

import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, subDays, EachDayOfIntervalResult } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTransactions } from '@/store/use-transactions';
import { Skeleton } from '@/components/ui/skeleton';
interface TransactionTrendsProps {
  transactions: Transaction[];
  monthStart?: Date;
  monthEnd?: Date;
}

const currentDate = new Date();

interface TrendsData {
  date: string;
  deposits: number;
  withdrawals: number;
}

export function TransactionTrends() {
  const transactions = useTransactions((state) => state.transactions);
  const [dailyData, setDailyData] = useState<TrendsData[]>();
  const [isEmpty, setIsEmpty] = useState(true);
  useEffect(() => {
    if (transactions === undefined || typeof transactions.filter != 'function' || transactions.length === 0) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    const endDate = transactions[0].date;
    const startDate = transactions[transactions.length - 1].date;
    const data = eachDayOfInterval({ start: startDate ?? subDays(new Date(), 15), end: endDate ?? new Date() }).map(date => {
      const dayTransactions = transactions.filter(t => {
        const transactionDate = parseISO(t.date);
        return format(transactionDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      const deposits = dayTransactions
        .filter(t => t.transaction_type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0) / 100;

      const withdrawals = dayTransactions
        .filter(t => t.transaction_type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0) / 100;

      return {
        date: format(date, 'MMM dd'),
        deposits,
        withdrawals,
      };
    });
    setDailyData(data)
    console.log("dailyData: ")
    console.log(data)
    console.log("transactions trends: ")
    console.log(transactions)
  }, [transactions]);

  if (isEmpty) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Monthly Transaction Trends.</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <Skeleton className="h-full w-full rounded-lg" />
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Transaction Trends.</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value: number) => `R$ ${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const depositsValue = typeof payload[0]?.value === 'number' ? payload[0].value.toFixed(2) : '0.00';
                    const withdrawalsValue = typeof payload[1]?.value === 'number' ? payload[1].value.toFixed(2) : '0.00';
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-semibold">{label}</p>
                        <p className="text-emerald-500">Deposits: R$ {depositsValue}</p>
                        <p className="text-red-500">Withdrawals: R$ {withdrawalsValue}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="withdrawals"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}