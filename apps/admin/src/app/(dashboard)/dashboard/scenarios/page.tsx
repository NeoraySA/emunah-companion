'use client';

import { useState } from 'react';
import { useScenarios, useCreateScenario, useUpdateScenario, useDeleteScenario } from '@/hooks';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, ListOrdered, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Scenario } from '@emunah/shared';
import { ScenarioStepsDialog } from './steps-dialog';

// ---- Types ----

interface ScenarioFormData {
  key: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const DEFAULT_FORM: ScenarioFormData = {
  key: '',
  category: '',
  sortOrder: 0,
  isActive: true,
};

const CATEGORIES = ['faith', 'bittachon', 'prayer', 'gratitude', 'general'];

// ---- Page ----

export default function ScenariosPage() {
  const { data: scenarios, isLoading } = useScenarios();
  const createMutation = useCreateScenario();
  const updateMutation = useUpdateScenario();
  const deleteMutation = useDeleteScenario();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [stepsScenarioId, setStepsScenarioId] = useState<number | null>(null);
  const [form, setForm] = useState<ScenarioFormData>(DEFAULT_FORM);

  // ---- Handlers ----

  const openCreate = () => {
    setEditingScenario(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setForm({
      key: scenario.key,
      category: scenario.category,
      sortOrder: scenario.sortOrder,
      isActive: scenario.isActive,
    });
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const openSteps = (scenarioId: number) => {
    setStepsScenarioId(scenarioId);
    setStepsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.key.trim() || !form.category.trim()) {
      toast.error('יש למלא מפתח וקטגוריה');
      return;
    }

    try {
      if (editingScenario) {
        await updateMutation.mutateAsync({
          id: editingScenario.id,
          data: form,
        });
        toast.success('תרחיש עודכן בהצלחה');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('תרחיש נוצר בהצלחה');
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
      toast.success('תרחיש נמחק');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch {
      toast.error('שגיאה במחיקה');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ---- Render ----

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">תרחישים</h1>
          <p className="text-muted-foreground">ניהול תרחישי אמונה ובטחון</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 ml-2" />
          תרחיש חדש
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !scenarios?.length ? (
        <div className="text-center py-12 text-muted-foreground">
          אין תרחישים עדיין. לחץ &quot;תרחיש חדש&quot; כדי להתחיל.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מפתח</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>סדר</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium">{scenario.key}</TableCell>
                  <TableCell>{scenario.category}</TableCell>
                  <TableCell>{scenario.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={scenario.isActive ? 'success' : 'secondary'}>
                      {scenario.isActive ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="שלבים"
                        onClick={() => openSteps(scenario.id)}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="עריכה"
                        onClick={() => openEdit(scenario)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="מחיקה"
                        onClick={() => openDelete(scenario.id)}
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
            <DialogTitle>{editingScenario ? 'עריכת תרחיש' : 'תרחיש חדש'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key">מפתח (key)</Label>
              <Input
                id="key"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="e.g. faith_morning"
                disabled={!!editingScenario}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">קטגוריה</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {editingScenario ? 'עדכון' : 'יצירה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת תרחיש</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            האם אתה בטוח שברצונך למחוק את התרחיש? פעולה זו ניתנת לשחזור.
          </p>
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

      {/* Steps Dialog */}
      {stepsScenarioId && (
        <ScenarioStepsDialog
          scenarioId={stepsScenarioId}
          open={stepsDialogOpen}
          onOpenChange={(open) => {
            setStepsDialogOpen(open);
            if (!open) setStepsScenarioId(null);
          }}
        />
      )}
    </div>
  );
}
