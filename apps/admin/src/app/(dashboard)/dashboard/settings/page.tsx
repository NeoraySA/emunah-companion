import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Settings page – placeholder.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">הגדרות</h1>
        <p className="text-muted-foreground">הגדרות מערכת ותצורה</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות כלליות</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">בקרוב: הגדרות שפות, גיבוי, ייצוא נתונים</p>
        </CardContent>
      </Card>
    </div>
  );
}
