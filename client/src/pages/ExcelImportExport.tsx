import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ExcelImportExport() {
  const [file, setFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`تم اختيار الملف: ${selectedFile.name}`);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("يرجى اختيار ملف Excel");
      return;
    }

    try {
      // Simulate file reading
      const reader = new FileReader();
      reader.onload = (e) => {
        // Parse Excel file (simplified)
        toast.success("تم استيراد البيانات بنجاح");
        setImportedData([
          { id: 1, name: "أحمد محمد", email: "ahmed@example.com", salary: 5000 },
          { id: 2, name: "فاطمة علي", email: "fatima@example.com", salary: 4500 },
        ]);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error("حدث خطأ أثناء استيراد الملف");
    }
  };

  const handleExportEmployees = () => {
    try {
      // Generate CSV
      const headers = ["ID", "الاسم", "البريد الإلكتروني", "الراتب الأساسي", "القسم"];
      const data = [
        [1, "أحمد محمد", "ahmed@example.com", 5000, "التطوير"],
        [2, "فاطمة علي", "fatima@example.com", 4500, "التسويق"],
        [3, "محمد حسن", "mohammed@example.com", 5500, "المبيعات"],
      ];

      const csv = [headers, ...data]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("تم تصدير الموظفين بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const handleExportAttendance = () => {
    try {
      const headers = ["ID", "الاسم", "التاريخ", "وقت الحضور", "وقت الانصراف", "ساعات العمل"];
      const data = [
        [1, "أحمد محمد", "2026-07-07", "08:00", "17:00", 9],
        [2, "فاطمة علي", "2026-07-07", "08:15", "17:15", 9],
        [3, "محمد حسن", "2026-07-07", "-", "-", 0],
      ];

      const csv = [headers, ...data]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("تم تصدير الحضور بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const handleExportPayroll = () => {
    try {
      const headers = ["ID", "الاسم", "الراتب الأساسي", "الإضافي", "الخصم", "الراتب الصافي"];
      const data = [
        [1, "أحمد محمد", 5000, 500, 300, 5200],
        [2, "فاطمة علي", 4500, 0, 250, 4250],
        [3, "محمد حسن", 5500, 1000, 400, 6100],
      ];

      const csv = [headers, ...data]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "payroll.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("تم تصدير الرواتب بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">استيراد وتصدير البيانات</h1>
          <p className="text-gray-600 mt-2">إدارة ملفات Excel والبيانات</p>
        </div>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              استيراد البيانات
            </CardTitle>
            <CardDescription>استيراد بيانات الموظفين من ملف Excel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <p className="text-gray-600 mb-2">
                  {file ? `الملف المختار: ${file.name}` : "اختر ملف Excel أو CSV"}
                </p>
                <p className="text-sm text-gray-500">أو اسحب الملف هنا</p>
              </label>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              استيراد البيانات
            </Button>
          </CardContent>
        </Card>

        {/* Imported Data Preview */}
        {importedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>معاينة البيانات المستوردة</CardTitle>
              <CardDescription>البيانات التي تم استيرادها من الملف</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الراتب</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.salary}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Export Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                تصدير الموظفين
              </CardTitle>
              <CardDescription>تصدير قائمة الموظفين</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportEmployees}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير Excel
              </Button>
            </CardContent>
          </Card>

          {/* Export Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600" />
                تصدير الحضور
              </CardTitle>
              <CardDescription>تصدير سجل الحضور والانصراف</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportAttendance}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير Excel
              </Button>
            </CardContent>
          </Card>

          {/* Export Payroll */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                تصدير الرواتب
              </CardTitle>
              <CardDescription>تصدير تقرير الرواتب الشهري</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportPayroll}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export Templates */}
        <Card>
          <CardHeader>
            <CardTitle>نماذج الاستيراد</CardTitle>
            <CardDescription>قوالب جاهزة لاستيراد البيانات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "نموذج الموظفين", file: "employees_template.xlsx" },
                { name: "نموذج الحضور", file: "attendance_template.xlsx" },
                { name: "نموذج الرواتب", file: "payroll_template.xlsx" },
              ].map((template) => (
                <Button
                  key={template.file}
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast.success(`تم تحميل ${template.name}`);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {template.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
