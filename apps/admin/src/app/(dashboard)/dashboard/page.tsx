'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Home, FileText, Users, Image, Loader2 } from 'lucide-react';
import { useDashboardStats } from '@/hooks';

/**
 * Dashboard home page – live overview of content stats.
 */
export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    { name: 'תרחישים', value: stats?.scenarios ?? 0, icon: BookOpen, href: '/dashboard/scenarios' },
    {
      name: 'כפתורי בית',
      value: stats?.homeButtons ?? 0,
      icon: Home,
      href: '/dashboard/home-buttons',
    },
    {
      name: 'תרגומים',
      value: stats?.translations ?? 0,
      icon: FileText,
      href: '/dashboard/translations',
    },
    { name: 'משתמשים', value: stats?.users ?? 0, icon: Users, href: '/dashboard/users' },
    { name: 'קבצי מדיה', value: stats?.media ?? 0, icon: Image, href: '/dashboard/media' },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">לוח בקרה</h1>
        <p className="text-muted-foreground">ברוכים הבאים לממשק הניהול של אמונה</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/scenarios"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            יצירת תרחיש חדש
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/dashboard/media"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            העלאת מדיה
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/dashboard/translations"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            ניהול תרגומים
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
