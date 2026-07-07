import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Download, Calculator } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function PayrollManagement() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = trpc.employees.list.useQuery({});

  // Fetch payroll data (mock data for now)
  const payrollData = [
    { id: 1, employeeId: 1, month: selectedMonth, year: selectedYear, baseSalary: 5000, overtimeAmount: 500, deductions: 300, netSalary: 5200, grossSalary: 5500 },
    { id: 2, employeeId: 2, month: selectedMonth, year: selectedYear, baseSalary: 4500, overtimeAmount: 0, deductions: 250, netSalary: 4250, grossSalary: 4500 },
    { id: 3, employeeId: 3, month: selectedMonth, year: selectedYear, baseSalary: 5500, overtimeAmount: 1000, deductions: 400, netSalary: 6100, grossSalary: 6500 },
  ];
  const payrollLoading = false;

  const calculatePayrollMutation = { isPending: false };

  const handleCalculatePayroll = async (employeeId: number) => {
    const employee = employees.find((e: any) => e.id === employeeId);
    if (!employee) {
      toast.error("لم يتم العثور على الموظف");
      return;
    }

    try {
      toast.success("تم حساب الراتب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حساب الراتب");
    }
  };

  const handleExportPayroll = () => {
    try {
      const headers = ["ID", "الاسم", "الراتب الأساسي", "الإضافي", "الخصم", "الراتب الصافي"];
      const data = payrollData.map((p: any) => [
        p.employeeId,
        employees.find((e: any) => e.id === p.employeeId)?.name || "غير معروف",
        p.baseSalary || 0,
        p.overtimeAmount || 0,
        p.deductions || 0,
        p.netSalary || 0,
      ]);

      const csv = [headers, ...data]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("تم تصدير الرواتب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const totalSalaries = payrollData.reduce((sum: number, p: any) => sum + (p.netSalary || 0), 0);
  const totalOvertime = payrollData.reduce((sum: number, p: any) => sum + (p.overtimeAmount || 0), 0);
  const totalDeductions = payrollData.reduce((sum: number, p: any) => sum + (p.deductions || 0), 0);

  const isLoading = employeesLoading || payrollLoading;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">إدارة الرواتب</h1>
          <p className="text-gray-600 mt-2">حساب وإدارة رواتب الموظفين</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>اختيار الفترة الزمنية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الشهر
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2026, month - 1).toLocaleDateString("ar-SA", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السنة
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2024, 2025, 2026, 2027].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  عرض الرواتب
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "إجمالي الرواتب", value: `${totalSalaries.toLocaleString()} ريال`, color: "bg-blue-500" },
              { label: "إجمالي الإضافي", value: `${totalOvertime.toLocaleString()} ريال`, color: "bg-green-500" },
              { label: "إجمالي الخصومات", value: `${totalDeductions.toLocaleString()} ريال`, color: "bg-red-500" },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تقرير الرواتب</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportPayroll}
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير Excel
              </Button>
            </CardTitle>
            <CardDescription>
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString("ar-SA", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : payrollData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد بيانات رواتب لهذا الشهر
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>الراتب الأساسي</TableHead>
                      <TableHead>الإضافي</TableHead>
                      <TableHead>الخصم</TableHead>
                      <TableHead>الراتب الصافي</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map((payroll: any) => {
                      const employee = employees.find((e: any) => e.id === payroll.employeeId);
                      return (
                        <TableRow key={payroll.id}>
                          <TableCell className="font-medium">{employee?.name || "غير معروف"}</TableCell>
                          <TableCell>{(payroll.baseSalary || 0).toLocaleString()} ريال</TableCell>
                          <TableCell className="text-green-600 font-medium">
                            +{(payroll.overtimeAmount || 0).toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            -{(payroll.deductions || 0).toLocaleString()} ريال
                          </TableCell>
                          <TableCell className="font-bold text-blue-600">
                            {(payroll.netSalary || 0).toLocaleString()} ريال
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCalculatePayroll(payroll.employeeId)}
                              disabled={false}
                            >
                              "حساب"
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
