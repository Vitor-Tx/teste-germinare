'use client';

import { Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useTransactions } from '@/store/use-transactions';

interface IndustryData {
    industry: string;
    amount: number
}

interface ExpenseBreakdownProps {
    transactions: Transaction[];
}

export function ExpenseBreakdown() {
    const transactions = useTransactions((state) => state.transactions);
    const [industryData, setIndustryData] = useState<IndustryData[]>();
    console.log("expensebreakdown transactions:")
    console.log(transactions)

    useEffect(() => {
        if (!transactions)
            return;
        const data = transactions
            .filter(t => t.transaction_type === 'withdraw')
            .reduce((acc, t) => {
                const existing = acc.find(item => item.industry === t.industry);
                if (existing) {
                    existing.amount += t.amount / 100;
                } else {
                    acc.push({ industry: t.industry, amount: t.amount / 100 });
                }
                return acc;
            }, [] as { industry: string; amount: number }[])
            .sort((a, b) => b.amount - a.amount);
        setIndustryData(data);
    }, [transactions])

    if (!transactions) {
        return (<></>);
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Expense Breakdown by Industry.</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={industryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="industry"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickFormatter={(value) => `R$ ${value}`}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const amountValue = typeof payload[0]?.value === 'number' ? payload[0].value.toFixed(2) : '0.00';
                                        return (
                                            <div className="bg-background border rounded-lg shadow-lg p-3">
                                                <p className="font-semibold">{label}</p>
                                                <p className="text-primary">
                                                    Amount: R$ {amountValue}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="amount"
                                fill="hsl(var(--chart-3))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}