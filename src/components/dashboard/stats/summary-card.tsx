'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: SummaryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn('transition-all duration-200', className, {
        'transform -translate-y-1': isHovered,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('transition-colors', {
          'text-emerald-500': trend && trend > 0,
          'text-red-500': trend && trend < 0,
          'text-muted-foreground': !trend
        })}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn('text-xs mt-2', {
            'text-emerald-500': trend > 0,
            'text-red-500': trend < 0,
          })}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}