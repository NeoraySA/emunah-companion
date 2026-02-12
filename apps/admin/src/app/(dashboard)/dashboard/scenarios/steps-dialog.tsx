'use client';

import { useState } from 'react';
import { useScenarioSteps, useCreateStep, useUpdateStep, useDeleteStep } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ScenarioStep, StepType } from '@emunah/shared';

// ---- Types ----

interface StepFormData {
  stepNumber: number;
  stepType: StepType;
  sortOrder: number;
}

const DEFAULT_STEP_FORM: StepFormData = {
  stepNumber: 1,
  stepType: 'text',
  sortOrder: 0,
};

const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: 'text', label: 'טקסט' },
  { value: 'prompt', label: 'שאלה' },
  { value: 'action', label: 'פעולה' },
  { value: 'summary', label: 'סיכום' },
];

const STEP_TYPE_VARIANT: Record<StepType, 'default' | 'secondary' | 'success' | 'warning'> = {
  text: 'default',
  prompt: 'warning',
  action: 'success',
  summary: 'secondary',
};

// ---- Props ----

interface ScenarioStepsDialogProps {
  scenarioId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScenarioStepsDialog({ scenarioId, open, onOpenChange }: ScenarioStepsDialogProps) {
  const { data: steps, isLoading } = useScenarioSteps(scenarioId);
  const createMutation = useCreateStep();
  const updateMutation = useUpdateStep();
  const deleteMutation = useDeleteStep();

  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<ScenarioStep | null>(null);
  const [form, setForm] = useState<StepFormData>(DEFAULT_STEP_FORM);

  // ---- Handlers ----

  const openCreateStep = () => {
    setEditingStep(null);
    const nextNumber = steps?.length ? Math.max(...steps.map((s) => s.stepNumber)) + 1 : 1;
    const nextSort = steps?.length ? Math.max(...steps.map((s) => s.sortOrder)) + 1 : 0;
    setForm({ stepNumber: nextNumber, stepType: 'text', sortOrder: nextSort });
    setStepDialogOpen(true);
  };

  const openEditStep = (step: ScenarioStep) => {
    setEditingStep(step);
    setForm({
      stepNumber: step.stepNumber,
      stepType: step.stepType,
      sortOrder: step.sortOrder,
    });
    setStepDialogOpen(true);
  };

  const handleSubmitStep = async () => {
    try {
      if (editingStep) {
        await updateMutation.mutateAsync({
          scenarioId,
          stepId: editingStep.id,
          data: form,
        });
        toast.success('שלב עודכן');
      } else {
        await createMutation.mutateAsync({ scenarioId, data: form });
        toast.success('שלב נוצר');
      }
      setStepDialogOpen(false);
    } catch {
      toast.error('שגיאה בשמירת שלב');
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    try {
      await deleteMutation.mutateAsync({ scenarioId, stepId });
      toast.success('שלב נמחק');
    } catch {
      toast.error('שגיאה במחיקת שלב');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ניהול שלבים – תרחיש #{scenarioId}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={openCreateStep}>
                <Plus className="h-4 w-4 ml-1" />
                שלב חדש
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !steps?.length ? (
              <p className="text-center py-8 text-muted-foreground">אין שלבים. הוסף שלב ראשון.</p>
            ) : (
              <div className="rounded-md border max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>סוג</TableHead>
                      <TableHead>סדר</TableHead>
                      <TableHead className="text-left">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {steps.map((step) => (
                      <TableRow key={step.id}>
                        <TableCell>{step.stepNumber}</TableCell>
                        <TableCell>
                          <Badge variant={STEP_TYPE_VARIANT[step.stepType]}>{step.stepType}</Badge>
                        </TableCell>
                        <TableCell>{step.sortOrder}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditStep(step)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteStep(step.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              סגירה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step create/edit sub-dialog */}
      <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStep ? 'עריכת שלב' : 'שלב חדש'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>מספר שלב</Label>
              <Input
                type="number"
                value={form.stepNumber}
                onChange={(e) => setForm({ ...form, stepNumber: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="grid gap-2">
              <Label>סוג שלב</Label>
              <Select
                value={form.stepType}
                onValueChange={(v) => setForm({ ...form, stepType: v as StepType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STEP_TYPES.map((st) => (
                    <SelectItem key={st.value} value={st.value}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>סדר מיון</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSubmitStep} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {editingStep ? 'עדכון' : 'יצירה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
