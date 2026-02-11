import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Home buttons management page – placeholder.
 */
export default function HomeButtonsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">כפתורי בית</h1>
          <p className="text-muted-foreground">ניהול כפתורי מסך הבית באפליקציה</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת כפתורים</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            בקרוב: ניהול כפתורים, סידור מחדש, הגדרת צבעים ואייקונים
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
