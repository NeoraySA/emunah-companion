'use client';

import { useState } from 'react';
import {
  useHomeButtons,
  useCreateHomeButton,
  useUpdateHomeButton,
  useDeleteHomeButton,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { HomeButton } from '@emunah/shared';

// ---- Types ----

interface HomeButtonFormData {
  key: string;
  icon: string;
  route: string;
  sortOrder: number;
  isActive: boolean;
}

const DEFAULT_FORM: HomeButtonFormData = {
  key: '',
  icon: '',
  route: '',
  sortOrder: 0,
  isActive: true,
};

// ---- Page ----

export default function HomeButtonsPage() {
  const { data: homeButtons, isLoading } = useHomeButtons();
  const createMutation = useCreateHomeButton();
  const updateMutation = useUpdateHomeButton();
  const deleteMutation = useDeleteHomeButton();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<HomeButton | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<HomeButtonFormData>(DEFAULT_FORM);

  // ---- Handlers ----

  const openCreate = () => {
    setEditingButton(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (btn: HomeButton) => {
    setEditingButton(btn);
    setForm({
      key: btn.key,
      icon: btn.icon,
      route: btn.route,
      sortOrder: btn.sortOrder,
      isActive: btn.isActive,
    });
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.key.trim() || !form.icon.trim() || !form.route.trim()) {
      toast.error('יש למלא מפתח, אייקון ונתיב');
      return;
    }

    try {
      if (editingButton) {
        await updateMutation.mutateAsync({ id: editingButton.id, data: form });
        toast.success('כפתור עודכן בהצלחה');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('כפתור נוצר בהצלחה');
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'שגיאה לא צפויה';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('כפתור נמחק');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch {
      toast.error('שגיאה במחיקה');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">כפתורי בית</h1>
          <p className="text-muted-foreground">ניהול כפתורי מסך הבית באפליקציה</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 ml-2" />
          כפתור חדש
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !homeButtons?.length ? (
        <div className="text-center py-12 text-muted-foreground">
          אין כפתורי בית. לחץ &quot;כפתור חדש&quot; כדי להתחיל.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מפתח</TableHead>
                <TableHead>אייקון</TableHead>
                <TableHead>נתיב</TableHead>
                <TableHead>סדר</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeButtons.map((btn) => (
                <TableRow key={btn.id}>
                  <TableCell className="font-medium">{btn.key}</TableCell>
                  <TableCell>{btn.icon}</TableCell>
                  <TableCell className="font-mono text-xs">{btn.route}</TableCell>
                  <TableCell>{btn.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={btn.isActive ? 'success' : 'secondary'}>
                      {btn.isActive ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="עריכה"
                        onClick={() => openEdit(btn)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="מחיקה"
                        onClick={() => openDelete(btn.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingButton ? 'עריכת כפתור' : 'כפתור חדש'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key">מפתח (key)</Label>
              <Input
                id="key"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="e.g. scenarios"
                disabled={!!editingButton}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">אייקון</Label>
              <Input
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. BookOpen"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="route">נתיב (route)</Label>
              <Input
                id="route"
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                placeholder="e.g. /scenarios"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">סדר מיון</Label>
              <Input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive">פעיל</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {editingButton ? 'עדכון' : 'יצירה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת כפתור</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">האם אתה בטוח שברצונך למחוק את הכפתור?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              מחיקה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
