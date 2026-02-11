'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Home, Languages, Image, Users, Settings } from 'lucide-react';

const navItems = [
  { name: 'לוח בקרה', href: '/dashboard', icon: LayoutDashboard },
  { name: 'תרחישים', href: '/dashboard/scenarios', icon: BookOpen },
  { name: 'כפתורי בית', href: '/dashboard/home-buttons', icon: Home },
  { name: 'תרגומים', href: '/dashboard/translations', icon: Languages },
  { name: 'מדיה', href: '/dashboard/media', icon: Image },
  { name: 'משתמשים', href: '/dashboard/users', icon: Users },
  { name: 'הגדרות', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l bg-card hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-xl font-bold text-primary">אמונה – ניהול</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
