import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function EmployeeDetails() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || "0");
  const { data: employee, isLoading } = trpc.employees.get.useQuery({ id: employeeId });
  const { data: leaveBalance } = trpc.leaves.getBalance.useQuery({ employeeId });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">جاري تحميل البيانات...</div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-red-500">لم يتم العثور على الموظف</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/employees")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-600 mt-2">{employee.position} - {employee.department}</p>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
            <TabsTrigger value="employment">بيانات التوظيف</TabsTrigger>
            <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الموظف</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">البريد الإلكتروني</label>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">رقم الهاتف</label>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle>بيانات التوظيف</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">المنصب</label>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">القسم</label>
                  <p className="font-medium">{employee.department}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>البيانات المالية</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">الراتب الشهري</label>
                  <p className="font-medium">{employee.monthlySalary} ريال</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
