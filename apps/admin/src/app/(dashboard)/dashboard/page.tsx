import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Home, FileText, Users, Image } from 'lucide-react';

/**
 * Dashboard home page – overview of content stats.
 */
export default function DashboardPage() {
  // Placeholder stats – will be fetched from API
  const stats = [
    { name: 'תרחישים', value: 0, icon: BookOpen, href: '/dashboard/scenarios' },
    { name: 'כפתורי בית', value: 0, icon: Home, href: '/dashboard/home-buttons' },
    { name: 'תרגומים', value: 0, icon: FileText, href: '/dashboard/translations' },
    { name: 'משתמשים', value: 0, icon: Users, href: '/dashboard/users' },
    { name: 'קבצי מדיה', value: 0, icon: Image, href: '/dashboard/media' },
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
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          בקרוב: יצירת תרחיש חדש, העלאת מדיה, ניהול תרגומים
        </CardContent>
      </Card>
    </div>
  );
}
