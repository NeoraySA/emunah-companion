'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  useTranslations,
  useUpsertTranslations,
  useLanguages,
  useScenarios,
  useHomeButtons,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UpsertTranslation } from '@emunah/shared';

// ---- Constants ----

const ENTITY_TYPES = [
  { value: 'scenario', label: 'תרחישים' },
  { value: 'scenario_step', label: 'שלבי תרחיש' },
  { value: 'home_button', label: 'כפתורי בית' },
];

const FIELD_NAMES: Record<string, string[]> = {
  scenario: ['title', 'description'],
  scenario_step: ['title', 'body', 'promptText'],
  home_button: ['label', 'description'],
};

// ---- Page ----

export default function TranslationsPage() {
  const { data: languages } = useLanguages();
  const { data: scenarios } = useScenarios();
  const { data: homeButtons } = useHomeButtons();
  const upsertMutation = useUpsertTranslations();

  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState<number | undefined>(undefined);

  const { data: translations, isLoading } = useTranslations({
    entityType: entityType || undefined,
    entityId,
  });

  // Local editable state for translations
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Build a key for the editValues map
  const makeKey = useCallback((langId: number, field: string) => `${langId}-${field}`, []);

  // Sync translations from server to local edit state
  useEffect(() => {
    if (!translations) return;
    const values: Record<string, string> = {};
    for (const t of translations) {
      values[makeKey(t.languageId, t.fieldName)] = t.value;
    }
    setEditValues(values);
  }, [translations, makeKey]);

  // Get entities list based on selected type
  const entities =
    entityType === 'scenario'
      ? (scenarios ?? []).map((s) => ({ id: s.id, label: `${s.key} (${s.category})` }))
      : entityType === 'home_button'
        ? (homeButtons ?? []).map((b) => ({ id: b.id, label: b.key }))
        : [];

  const fields = FIELD_NAMES[entityType] ?? [];

  const handleSave = async () => {
    if (!entityType || !entityId || !languages?.length) {
      toast.error('יש לבחור סוג ישות וישות ספציפית');
      return;
    }

    const upserts: UpsertTranslation[] = [];
    for (const lang of languages) {
      for (const field of fields) {
        const key = makeKey(lang.id, field);
        const value = editValues[key];
        if (value !== undefined && value.trim() !== '') {
          upserts.push({
            entityType,
            entityId,
            languageId: lang.id,
            fieldName: field,
            value: value.trim(),
          });
        }
      }
    }

    if (!upserts.length) {
      toast.error('אין תרגומים לשמירה');
      return;
    }

    try {
      await upsertMutation.mutateAsync(upserts);
      toast.success(`${upserts.length} תרגומים נשמרו`);
    } catch {
      toast.error('שגיאה בשמירת תרגומים');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">תרגומים</h1>
        <p className="text-muted-foreground">ניהול תרגומי תוכן לעברית ואנגלית</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>בחירת ישות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>סוג ישות</Label>
              <Select
                value={entityType}
                onValueChange={(v) => {
                  setEntityType(v);
                  setEntityId(undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((et) => (
                    <SelectItem key={et.value} value={et.value}>
                      {et.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {entityType && entityType !== 'scenario_step' && (
              <div className="grid gap-2">
                <Label>ישות</Label>
                <Select
                  value={entityId?.toString() ?? ''}
                  onValueChange={(v) => setEntityId(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר ישות" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {entityType === 'scenario_step' && (
              <div className="grid gap-2">
                <Label>מזהה ישות (Entity ID)</Label>
                <Input
                  type="number"
                  value={entityId ?? ''}
                  onChange={(e) =>
                    setEntityId(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder="הזן ID של שלב"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Translations Editor */}
      {entityType && entityId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>עריכת תרגומים</CardTitle>
            <Button size="sm" onClick={handleSave} disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              שמירה
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">שדה</TableHead>
                      {(languages ?? []).map((lang) => (
                        <TableHead key={lang.id}>
                          {lang.name} ({lang.code})
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field) => (
                      <TableRow key={field}>
                        <TableCell className="font-medium">{field}</TableCell>
                        {(languages ?? []).map((lang) => {
                          const key = makeKey(lang.id, field);
                          return (
                            <TableCell key={lang.id}>
                              <Textarea
                                rows={2}
                                value={editValues[key] ?? ''}
                                onChange={(e) =>
                                  setEditValues({ ...editValues, [key]: e.target.value })
                                }
                                placeholder={`${field} (${lang.code})`}
                                dir={lang.code === 'he' ? 'rtl' : 'ltr'}
                              />
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
