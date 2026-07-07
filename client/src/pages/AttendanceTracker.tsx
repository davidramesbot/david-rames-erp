import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, XCircle, Clock, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('ar-SA'));

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ar-SA'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const recordCheckInMutation = trpc.attendance.recordCheckIn.useMutation();
  const recordCheckOutMutation = trpc.attendance.recordCheckOut.useMutation();

  const handleCheckIn = async (employeeId: number) => {
    try {
      await recordCheckInMutation.mutateAsync({
        employeeId,
        date: selectedDate,
      });
      toast.success("تم تسجيل الحضور بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الحضور");
    }
  };

  const handleCheckOut = async (employeeId: number) => {
    try {
      await recordCheckOutMutation.mutateAsync({
        employeeId,
        date: selectedDate,
      });
      toast.success("تم تسجيل الانصراف بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الانصراف");
    }
  };

  const attendanceData = [
    { id: 1, name: "أحمد محمد", checkIn: "08:00", checkOut: "17:00", status: "present" },
    { id: 2, name: "فاطمة علي", checkIn: "08:15", checkOut: "17:15", status: "present" },
    { id: 3, name: "محمد حسن", checkIn: null, checkOut: null, status: "absent" },
    { id: 4, name: "سارة أحمد", checkIn: "08:30", checkOut: null, status: "present" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نظام الحضور والانصراف</h1>
          <p className="text-gray-600 mt-2">تسجيل حضور وانصراف الموظفين بنظام البصمة</p>
        </div>

        {/* Biometric Check-in/Check-out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Card */}
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <LogIn className="h-5 w-5" />
                تسجيل الحضور
              </CardTitle>
              <CardDescription>نظام البصمة - الدخول</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر الموظف
                </label>
                <select
                  value={selectedEmployee || ""}
                  onChange={(e) => setSelectedEmployee(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- اختر موظف --</option>
                  {attendanceData.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="text-center py-8 bg-green-50 rounded-lg">
                <div className="text-5xl font-bold text-green-600 font-mono">
                  {currentTime}
                </div>
                <p className="text-gray-600 mt-2">الوقت الحالي</p>
              </div>

              <Button
                onClick={() => handleCheckIn(selectedEmployee || 0)}
                disabled={recordCheckInMutation.isPending || !selectedEmployee}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                تسجيل الحضور
              </Button>
            </CardContent>
          </Card>

          {/* Check-out Card */}
          <Card className="border-2 border-red-200 shadow-lg">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <LogOut className="h-5 w-5" />
                تسجيل الانصراف
              </CardTitle>
              <CardDescription>نظام البصمة - الخروج</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر الموظف
                </label>
                <select
                  value={selectedEmployee || ""}
                  onChange={(e) => setSelectedEmployee(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- اختر موظف --</option>
                  {attendanceData.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="text-center py-8 bg-red-50 rounded-lg">
                <div className="text-5xl font-bold text-red-600 font-mono">
                  {currentTime}
                </div>
                <p className="text-gray-600 mt-2">الوقت الحالي</p>
              </div>

              <Button
                onClick={() => handleCheckOut(selectedEmployee || 0)}
                disabled={recordCheckOutMutation.isPending || !selectedEmployee}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                تسجيل الانصراف
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              اختيار التاريخ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
          </CardContent>
        </Card>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">الحاضرين</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">الغائبين</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">المتأخرين</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">إجمالي الموظفين</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>سجل الحضور والانصراف</CardTitle>
            <CardDescription>تاريخ: {new Date(selectedDate).toLocaleDateString("ar-SA")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>وقت الحضور</TableHead>
                    <TableHead>وقت الانصراف</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>{record.checkOut || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status === "present" ? "حاضر" : "غائب"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckIn(record.id)}
                            disabled={recordCheckInMutation.isPending}
                          >
                            حضور
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(record.id)}
                            disabled={recordCheckOutMutation.isPending}
                          >
                            انصراف
                          </Button>
                        </div>
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
