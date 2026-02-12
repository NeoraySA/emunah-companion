'use client';

import { useState, useCallback } from 'react';
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pencil,
  Trash2,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  Shield,
  UserX,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminUser, RoleName } from '@emunah/shared';

// ---- Constants ----

const ROLE_LABELS: Record<RoleName, string> = {
  admin: 'מנהל',
  editor: 'עורך',
  user: 'משתמש',
};

const ROLE_VARIANTS: Record<RoleName, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  editor: 'secondary',
  user: 'outline',
};

// ---- Page ----

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleName | 'all'>('all');

  const { data, isLoading } = useUsers({
    page,
    limit: 20,
    search: search || undefined,
    role: roleFilter === 'all' ? undefined : roleFilter,
    sort: 'createdAt',
    order: 'desc',
  });

  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState<RoleName>('user');
  const [editActive, setEditActive] = useState(true);
  const [editDisplayName, setEditDisplayName] = useState('');

  const users = data?.users ?? [];
  const meta = data?.meta;

  // ---- Handlers ----

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const openEdit = useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditActive(user.isActive);
    setEditDisplayName(user.displayName ?? '');
    setEditDialogOpen(true);
  }, []);

  const openDelete = useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!selectedUser) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        data: {
          role: editRole,
          isActive: editActive,
          displayName: editDisplayName || undefined,
        },
      });
      toast.success('המשתמש עודכן בהצלחה');
      setEditDialogOpen(false);
    } catch {
      toast.error('שגיאה בעדכון המשתמש');
    }
  }, [selectedUser, editRole, editActive, editDisplayName, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!selectedUser) return;
    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      toast.success('המשתמש נמחק');
      setDeleteDialogOpen(false);
    } catch {
      toast.error('שגיאה במחיקת המשתמש');
    }
  }, [selectedUser, deleteMutation]);

  const toggleActive = useCallback(
    async (user: AdminUser) => {
      try {
        await updateMutation.mutateAsync({
          id: user.id,
          data: { isActive: !user.isActive },
        });
        toast.success(user.isActive ? 'המשתמש הושעה' : 'המשתמש הופעל');
      } catch {
        toast.error('שגיאה בעדכון הסטטוס');
      }
    },
    [updateMutation],
  );

  // ---- Helpers ----

  function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatDateTime(iso: string | null) {
    if (!iso) return 'לא התחבר';
    return new Date(iso).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // ---- Render ----

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">משתמשים</h1>
        <p className="text-muted-foreground">ניהול משתמשים, תפקידים והרשאות</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Input
            placeholder="חיפוש לפי אימייל או שם..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="text-right"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v as RoleName | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="כל התפקידים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל התפקידים</SelectItem>
            <SelectItem value="admin">מנהל</SelectItem>
            <SelectItem value="editor">עורך</SelectItem>
            <SelectItem value="user">משתמש</SelectItem>
          </SelectContent>
        </Select>

        {meta && (
          <span className="text-sm text-muted-foreground mr-auto">{meta.total} משתמשים</span>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם</TableHead>
              <TableHead className="text-right">אימייל</TableHead>
              <TableHead className="text-right">תפקיד</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">התחברות אחרונה</TableHead>
              <TableHead className="text-right">הצטרפות</TableHead>
              <TableHead className="text-right w-[120px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {search ? 'לא נמצאו משתמשים מתאימים' : 'אין משתמשים'}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className={!user.isActive ? 'opacity-50' : ''}>
                  <TableCell className="font-medium text-right">
                    {user.displayName || '—'}
                  </TableCell>
                  <TableCell className="text-right">{user.email}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={ROLE_VARIANTS[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'פעיל' : 'מושעה'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDateTime(user.lastLoginAt)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(user)}
                        title="ערוך"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(user)}
                        title={user.isActive ? 'השעה' : 'הפעל'}
                      >
                        {user.isActive ? (
                          <UserX className="h-4 w-4 text-orange-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDelete(user)}
                        title="מחק"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
            הקודם
          </Button>
          <span className="text-sm text-muted-foreground">
            עמוד {page} מתוך {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            הבא
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>עריכת משתמש</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedUser.email}</span>
              </div>

              <div className="space-y-2">
                <Label>שם תצוגה</Label>
                <Input
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="שם תצוגה"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label>תפקיד</Label>
                <Select value={editRole} onValueChange={(v) => setEditRole(v as RoleName)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <Shield className="h-3 w-3" /> מנהל
                      </span>
                    </SelectItem>
                    <SelectItem value="editor">עורך</SelectItem>
                    <SelectItem value="user">משתמש</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>סטטוס פעיל</Label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editActive}
                  onClick={() => setEditActive(!editActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editActive ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editActive ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle>מחיקת משתמש</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            האם למחוק את המשתמש{' '}
            <span className="font-medium text-foreground">{selectedUser?.email}</span>?
            <br />
            פעולה זו תשעה את המשתמש ותסיר אותו מהמערכת.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              מחק
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
