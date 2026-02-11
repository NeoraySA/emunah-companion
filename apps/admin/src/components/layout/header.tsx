'use client';

import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">תפריט</span>
      </Button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side – user menu */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">{user?.displayName || user?.email || 'מנהל'}</span>
          {user?.role && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {user.role === 'admin' ? 'מנהל' : 'עורך'}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" title="התנתק" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">התנתק</span>
        </Button>
      </div>
    </header>
  );
}
