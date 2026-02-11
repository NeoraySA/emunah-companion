import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Scenarios management page – placeholder.
 */
export default function ScenariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">תרחישים</h1>
          <p className="text-muted-foreground">ניהול תרחישי אמונה ובטחון</p>
        </div>
        {/* Add button will go here */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת תרחישים</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            בקרוב: טבלת תרחישים עם אפשרויות עריכה, מחיקה, וסידור מחדש
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
