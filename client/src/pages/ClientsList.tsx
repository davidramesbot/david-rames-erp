import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Search, Eye } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ClientsList() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients = [], isLoading } = trpc.clients.list.useQuery({});
  const deleteClientMutation = trpc.clients.delete.useMutation();

  const filteredClients = clients.filter((client: any) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      try {
        await deleteClientMutation.mutateAsync({ id });
        toast.success("تم حذف العميل بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف العميل");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة العملاء</h1>
            <p className="text-gray-600 mt-2">إضافة وتعديل وحذف العملاء</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/clients/new")}>
            <Plus className="h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 items-center">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="البحث عن عميل بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قائمة العملاء</CardTitle>
            <CardDescription>إجمالي العملاء: {filteredClients.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">جاري تحميل البيانات...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد عملاء</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم العميل</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>المدينة</TableHead>
                      <TableHead>الدولة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client: any) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="text-sm">{client.email || "-"}</TableCell>
                        <TableCell className="text-sm">{client.phone || "-"}</TableCell>
                        <TableCell>{client.city || "-"}</TableCell>
                        <TableCell>{client.country || "-"}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {client.status === "active" ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/clients/${client.id}`)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/clients/${client.id}/edit`)}
                              title="تعديل"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(client.id)}
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
