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

export default function EmployeesList() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: employees = [], isLoading } = trpc.employees.list.useQuery({});
  const deleteEmployeeMutation = trpc.employees.delete.useMutation();

  const filteredEmployees = employees.filter((emp: any) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الموظف؟")) {
      try {
        await deleteEmployeeMutation.mutateAsync({ id });
        toast.success("تم حذف الموظف بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف الموظف");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين</h1>
            <p className="text-gray-600 mt-2">إضافة وتعديل وحذف الموظفين</p>
          </div>
          <Button className="gap-2" onClick={() => navigate("/employees/new")}>
            <Plus className="h-4 w-4" />
            إضافة موظف جديد
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 items-center">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="البحث عن موظف بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الموظفين</CardTitle>
            <CardDescription>إجمالي الموظفين: {filteredEmployees.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">جاري تحميل البيانات...</div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد موظفين</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>المنصب</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((emp: any) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.position || "-"}</TableCell>
                        <TableCell>{emp.department || "-"}</TableCell>
                        <TableCell className="text-sm">{emp.email || "-"}</TableCell>
                        <TableCell className="text-sm">{emp.phone || "-"}</TableCell>
                        <TableCell>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {emp.status === "active" ? "نشط" : "غير نشط"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/employees/${emp.id}`)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/employees/${emp.id}/edit`)}
                              title="تعديل"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(emp.id)}
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
