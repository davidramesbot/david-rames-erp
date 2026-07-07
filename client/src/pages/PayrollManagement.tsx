import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Download } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const calculatePayrollMutation = trpc.payroll.calculate.useQuery({ employeeId: 1, month: selectedMonth, year: selectedYear, baseSalary: 5000, workingDaysInMonth: 22, presentDays: 22, absentDays: 1 });

  const payrollData = [
    {
      id: 1,
      name: "أحمد محمد",
      baseSalary: 5000,
      presentDays: 22,
      absentDays: 1,
      sickDays: 0,
      advances: 500,
      bonus: 0,
      deductions: 500,
      netSalary: 4500,
    },
    {
      id: 2,
      name: "فاطمة علي",
      baseSalary: 4500,
      presentDays: 23,
      absentDays: 0,
      sickDays: 0,
      advances: 0,
      bonus: 200,
      deductions: 0,
      netSalary: 4700,
    },
  ];

  const handleCalculatePayroll = async (employeeId: number) => {
    try {
      // Calculate payroll
      const result = {
        employeeId,
        month: selectedMonth,
        year: selectedYear,
        grossSalary: 5000,
        deductions: 300,
        netSalary: 4700,
        advanceAmount: 500,
      };
      toast.success("تم حساب الرواتب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حساب الراتب");
    }
  };

  const handleExportPayroll = () => {
    toast.success("جاري تصدير التقرير...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المرتبات</h1>
            <p className="text-gray-600 mt-2">حساب وإدارة رواتب الموظفين</p>
          </div>
          <Button className="gap-2" onClick={handleExportPayroll}>
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
        </div>

        {/* Month/Year Selection */}
        <Card>
          <CardHeader>
            <CardTitle>اختيار الفترة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">الشهر</label>
                <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(2024, i).toLocaleDateString("ar-SA", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">السنة</label>
                <Input type="number" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">إجمالي الرواتب</p>
                <p className="text-2xl font-bold">9,200 ريال</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">إجمالي الخصومات</p>
                <p className="text-2xl font-bold">500 ريال</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">الصافي المستحق</p>
                <p className="text-2xl font-bold">8,700 ريال</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الرواتب</CardTitle>
            <CardDescription>
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>الراتب الأساسي</TableHead>
                    <TableHead>أيام الحضور</TableHead>
                    <TableHead>أيام الغياب</TableHead>
                    <TableHead>السلف</TableHead>
                    <TableHead>الحوافز</TableHead>
                    <TableHead>الخصومات</TableHead>
                    <TableHead>الراتب الصافي</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.baseSalary} ريال</TableCell>
                      <TableCell>{record.presentDays}</TableCell>
                      <TableCell>{record.absentDays}</TableCell>
                      <TableCell>{record.advances} ريال</TableCell>
                      <TableCell>{record.bonus} ريال</TableCell>
                      <TableCell>{record.deductions} ريال</TableCell>
                      <TableCell className="font-bold text-green-600">{record.netSalary} ريال</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCalculatePayroll(record.id)}
                          disabled={calculatePayrollMutation.isPending}
                        >
                          حساب
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
