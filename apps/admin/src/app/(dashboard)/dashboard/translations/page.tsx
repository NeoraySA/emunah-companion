import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Translations management page – placeholder.
 */
export default function TranslationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">תרגומים</h1>
          <p className="text-muted-foreground">ניהול תרגומי תוכן לעברית ואנגלית</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>טבלת תרגומים</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">בקרוב: עריכת תרגומים, סינון לפי שפה, חיפוש, ייצוא</p>
        </CardContent>
      </Card>
    </div>
  );
}
