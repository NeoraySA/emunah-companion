import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Users management page – placeholder.
 */
export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">משתמשים</h1>
          <p className="text-muted-foreground">ניהול משתמשים והרשאות</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>רשימת משתמשים</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">בקרוב: טבלת משתמשים, שינוי תפקידים, השעיה, מחיקה</p>
        </CardContent>
      </Card>
    </div>
  );
}
