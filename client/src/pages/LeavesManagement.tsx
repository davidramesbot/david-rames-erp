import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function LeavesManagement() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveType, setLeaveType] = useState("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const requestLeaveMutation = trpc.leaves.getBalance.useQuery({ employeeId: 1 });
  const submitLeaveMutation = trpc.leaves.getBalance.useQuery({ employeeId: 1 });

  const leaveRequests = [
    {
      id: 1,
      employee: "أحمد محمد",
      type: "إجازة سنوية",
      startDate: "2026-06-10",
      endDate: "2026-06-15",
      days: 5,
      status: "approved",
      reason: "إجازة شخصية",
    },
    {
      id: 2,
      employee: "فاطمة علي",
      type: "إجازة مرضية",
      startDate: "2026-06-05",
      endDate: "2026-06-07",
      days: 2,
      status: "pending",
      reason: "مرض",
    },
    {
      id: 3,
      employee: "محمد حسن",
      type: "إجازة طارئة",
      startDate: "2026-06-08",
      endDate: "2026-06-08",
      days: 1,
      status: "rejected",
      reason: "ظرف طارئ",
    },
  ];

  const handleRequestLeave = async () => {
    if (!startDate || !endDate) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      // Submit leave request
      toast.info("تم تقديم طلب الإجازة");

      toast.success("تم تقديم طلب الإجازة بنجاح");
      setShowRequestForm(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error) {
      toast.error("حدث خطأ أثناء تقديم الطلب");
    }
  };

  const handleSubmitLeave = () => {
    if (!startDate || !endDate) {
      toast.error("يرجى اختيار التاريخ");
      return;
    }
    handleRequestLeave();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">موافق عليه</span>;
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">قيد الانتظار</span>;
      case "rejected":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">مرفوض</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإجازات</h1>
            <p className="text-gray-600 mt-2">طلب ومتابعة الإجازات</p>
          </div>
          <Button className="gap-2" onClick={() => setShowRequestForm(!showRequestForm)}>
            <Plus className="h-4 w-4" />
            طلب إجازة جديدة
          </Button>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <Card>
            <CardHeader>
              <CardTitle>تقديم طلب إجازة جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">نوع الإجازة</label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">إجازة سنوية</SelectItem>
                      <SelectItem value="sick">إجازة مرضية</SelectItem>
                      <SelectItem value="emergency">إجازة طارئة</SelectItem>
                      <SelectItem value="unpaid">إجازة بدون راتب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">عدد الأيام</label>
                  <Input
                    type="number"
                    placeholder="سيتم حسابها تلقائياً"
                    disabled
                    value={
                      startDate && endDate
                        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                        : ""
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">تاريخ البداية</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">تاريخ النهاية</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">السبب</label>
                <Textarea
                  placeholder="اذكر سبب الإجازة..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleRequestLeave} disabled={requestLeaveMutation.isPending}>
                  تقديم الطلب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">الإجازات السنوية</p>
                <p className="text-2xl font-bold">20</p>
                <p className="text-xs text-gray-500 mt-1">متبقي من 30</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">الإجازات المرضية</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-gray-500 mt-1">متبقي من 15</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">الإجازات الطارئة</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-gray-500 mt-1">متبقي من 5</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">إجمالي الإجازات</p>
                <p className="text-2xl font-bold">36</p>
                <p className="text-xs text-gray-500 mt-1">متبقي من 50</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>طلبات الإجازات</CardTitle>
            <CardDescription>جميع طلبات الإجازات المقدمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>نوع الإجازة</TableHead>
                    <TableHead>من</TableHead>
                    <TableHead>إلى</TableHead>
                    <TableHead>عدد الأيام</TableHead>
                    <TableHead>السبب</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell className="text-sm">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
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
