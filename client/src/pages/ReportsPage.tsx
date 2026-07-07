import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, FileText, Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthlyReportData = [
    {
      id: 1,
      name: "أحمد محمد",
      department: "التطوير",
      presentDays: 22,
      absentDays: 1,
      sickDays: 0,
      leaveDays: 0,
      workingHours: 176,
      overtime: 8,
      baseSalary: 5000,
      overtime_amount: 500,
      deductions: 300,
      netSalary: 5200,
    },
    {
      id: 2,
      name: "فاطمة علي",
      department: "التسويق",
      presentDays: 21,
      absentDays: 2,
      sickDays: 0,
      leaveDays: 0,
      workingHours: 168,
      overtime: 0,
      baseSalary: 4500,
      overtime_amount: 0,
      deductions: 250,
      netSalary: 4250,
    },
    {
      id: 3,
      name: "محمد حسن",
      department: "المبيعات",
      presentDays: 23,
      absentDays: 0,
      sickDays: 0,
      leaveDays: 0,
      workingHours: 184,
      overtime: 16,
      baseSalary: 5500,
      overtime_amount: 1000,
      deductions: 400,
      netSalary: 6100,
    },
  ];

  const handleExportReport = (format: "pdf" | "excel") => {
    try {
      if (format === "pdf") {
        toast.success("تم تصدير التقرير إلى PDF");
      } else {
        toast.success("تم تصدير التقرير إلى Excel");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const handlePrintReport = () => {
    window.print();
    toast.success("تم فتح نافذة الطباعة");
  };

  const totalSalaries = monthlyReportData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const totalOvertime = monthlyReportData.reduce((sum, emp) => sum + emp.overtime_amount, 0);
  const totalDeductions = monthlyReportData.reduce((sum, emp) => sum + emp.deductions, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600 mt-2">تقارير الموظفين والرواتب الشهرية</p>
        </div>

        {/* Report Filters */}
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
                  <BarChart3 className="h-4 w-4 mr-2" />
                  عرض التقرير
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "إجمالي الرواتب", value: `${totalSalaries.toLocaleString()} ريال`, color: "bg-blue-500" },
            { label: "إجمالي الإضافي", value: `${totalOvertime.toLocaleString()} ريال`, color: "bg-green-500" },
            { label: "إجمالي الخصومات", value: `${totalDeductions.toLocaleString()} ريال`, color: "bg-red-500" },
            { label: "عدد الموظفين", value: monthlyReportData.length.toString(), color: "bg-purple-500" },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Monthly Report Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تقرير الرواتب الشهري
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportReport("excel")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportReport("pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrintReport}
                >
                  طباعة
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString("ar-SA", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>أيام الحضور</TableHead>
                    <TableHead>أيام الغياب</TableHead>
                    <TableHead>الراتب الأساسي</TableHead>
                    <TableHead>الإضافي</TableHead>
                    <TableHead>الخصم</TableHead>
                    <TableHead>الراتب الصافي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReportData.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.presentDays}</TableCell>
                      <TableCell>{emp.absentDays}</TableCell>
                      <TableCell>{emp.baseSalary.toLocaleString()} ريال</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        +{emp.overtime_amount.toLocaleString()} ريال
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        -{emp.deductions.toLocaleString()} ريال
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {emp.netSalary.toLocaleString()} ريال
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary Row */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="grid grid-cols-8 gap-4 font-bold text-lg">
                <div></div>
                <div></div>
                <div className="text-right">المجموع</div>
                <div></div>
                <div className="text-right">{monthlyReportData.reduce((sum, e) => sum + e.baseSalary, 0).toLocaleString()} ريال</div>
                <div className="text-green-600">+{totalOvertime.toLocaleString()} ريال</div>
                <div className="text-red-600">-{totalDeductions.toLocaleString()} ريال</div>
                <div className="text-blue-600">{totalSalaries.toLocaleString()} ريال</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص الحضور والغياب</CardTitle>
            <CardDescription>إحصائيات الحضور للموظفين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyReportData.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-sm text-gray-600">{emp.department}</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{emp.presentDays}</p>
                      <p className="text-xs text-gray-600">حاضر</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{emp.absentDays}</p>
                      <p className="text-xs text-gray-600">غائب</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{emp.workingHours}</p>
                      <p className="text-xs text-gray-600">ساعة عمل</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
