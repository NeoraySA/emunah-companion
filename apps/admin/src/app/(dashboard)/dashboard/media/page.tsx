import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Media management page – placeholder.
 */
export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">מדיה</h1>
          <p className="text-muted-foreground">ניהול קבצי תמונות, אודיו ווידאו</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ספריית מדיה</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">בקרוב: העלאת קבצים, תצוגת גלריה, מחיקה, חיפוש</p>
        </CardContent>
      </Card>
    </div>
  );
}
