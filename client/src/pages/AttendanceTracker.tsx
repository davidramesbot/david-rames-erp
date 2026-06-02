import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

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
          <p className="text-gray-600 mt-2">تسجيل حضور وانصراف الموظفين</p>
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
