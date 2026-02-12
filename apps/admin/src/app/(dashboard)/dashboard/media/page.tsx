'use client';

import { useState, useRef } from 'react';
import { useMedia, useUploadMedia, useDeleteMedia } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, Trash2, Loader2, FileAudio, FileVideo, FileText, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { MediaAsset } from '@emunah/shared';

// ---- Helpers ----

function getMediaIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('audio/')) return FileAudio;
  if (mimeType.startsWith('video/')) return FileVideo;
  return FileText;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---- Page ----

export default function MediaPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMedia({ page, limit: 20 });
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null);

  const media = data?.media ?? [];
  const meta = data?.meta;

  // ---- Handlers ----

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await uploadMutation.mutateAsync(formData);
        toast.success(`${file.name} הועלה בהצלחה`);
      } catch {
        toast.error(`שגיאה בהעלאת ${file.name}`);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openDelete = (asset: MediaAsset) => {
    setDeletingAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAsset) return;
    try {
      await deleteMutation.mutateAsync(deletingAsset.id);
      toast.success('קובץ נמחק');
      setDeleteDialogOpen(false);
      setDeletingAsset(null);
    } catch {
      toast.error('שגיאה במחיקה');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">מדיה</h1>
          <p className="text-muted-foreground">ניהול קבצי תמונות, אודיו ווידאו</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,audio/*,video/*,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 ml-2" />
            )}
            העלאת קובץ
          </Button>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !media.length ? (
        <div className="text-center py-12 text-muted-foreground">
          אין קבצי מדיה. לחץ &quot;העלאת קובץ&quot; כדי להתחיל.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {media.map((asset) => {
              const Icon = getMediaIcon(asset.mimeType);
              return (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="h-32 bg-muted flex items-center justify-center">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate" title={asset.filename}>
                      {asset.filename}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {asset.mimeType.split('/')[1]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(asset.sizeBytes)}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="מחיקה"
                        onClick={() => openDelete(asset)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת קובץ</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            האם אתה בטוח שברצונך למחוק את <strong>{deletingAsset?.filename}</strong>?
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
    </div>
  );
}
