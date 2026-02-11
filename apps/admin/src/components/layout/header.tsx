'use client';

import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';

export function Header() {
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
          <span className="hidden sm:inline">מנהל</span>
        </div>
        <Button variant="ghost" size="icon" title="התנתק">
          <LogOut className="h-4 w-4" />
          <span className="sr-only">התנתק</span>
        </Button>
      </div>
    </header>
  );
}
