import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ClientDetails() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const clientId = parseInt(id || "0");
  const { data: client, isLoading } = trpc.clients.get.useQuery({ id: clientId });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">جاري تحميل البيانات...</div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-red-500">لم يتم العثور على العميل</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600 mt-2">معلومات العميل</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">معلومات عامة</TabsTrigger>
            <TabsTrigger value="contact">جهات الاتصال</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>البيانات الأساسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">اسم العميل</label>
                    <p className="font-medium">{client.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">الرقم الضريبي</label>
                    <p className="font-medium">{client.taxId || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الموقع الجغرافي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">المدينة</label>
                    <p className="font-medium">{client.city || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">الدولة</label>
                    <p className="font-medium">{client.country || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>العنوان</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{client.address || "-"}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">البريد الإلكتروني</label>
                  <p className="font-medium">{client.email || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">رقم الهاتف</label>
                  <p className="font-medium">{client.phone || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">جهة الاتصال</label>
                  <p className="font-medium">{client.contactPerson || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">هاتف جهة الاتصال</label>
                  <p className="font-medium">{client.contactPhone || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>المشاريع المرتبطة</CardTitle>
                <CardDescription>المشاريع الجارية والمكتملة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">لا توجد مشاريع مرتبطة</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
