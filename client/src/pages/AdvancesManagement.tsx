import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingDown } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdvancesManagement() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const requestAdvanceMutation = trpc.advances.request.useMutation();

  const advanceRequests = [
    {
      id: 1,
      employee: "أحمد محمد",
      amount: 500,
      requestDate: "2026-05-20",
      status: "approved",
      reason: "احتياج شخصي",
      installments: 3,
      paidInstallments: 1,
    },
    {
      id: 2,
      employee: "فاطمة علي",
      amount: 1000,
      requestDate: "2026-05-25",
      status: "pending",
      reason: "مصاريف طبية",
      installments: 0,
      paidInstallments: 0,
    },
    {
      id: 3,
      employee: "محمد حسن",
      amount: 750,
      requestDate: "2026-05-15",
      status: "approved",
      reason: "سداد ديون",
      installments: 2,
      paidInstallments: 2,
    },
  ];

  const handleRequestAdvance = async () => {
    if (!amount) {
      toast.error("يرجى إدخال المبلغ");
      return;
    }

    try {
      await requestAdvanceMutation.mutateAsync({
        employeeId: 1,
        amount,
        reason,
      });

      toast.success("تم تقديم طلب السلفة بنجاح");
      setShowRequestForm(false);
      setAmount("");
      setReason("");
    } catch (error) {
      toast.error("حدث خطأ أثناء تقديم الطلب");
    }
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

  const totalAdvances = advanceRequests.reduce((sum, req) => sum + req.amount, 0);
  const totalPaid = advanceRequests
    .filter((req) => req.status === "approved")
    .reduce((sum, req) => sum + (req.amount / req.installments) * req.paidInstallments, 0);
  const totalRemaining = totalAdvances - totalPaid;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة السلف</h1>
            <p className="text-gray-600 mt-2">طلب ومتابعة السلف الموظفة</p>
          </div>
          <Button className="gap-2" onClick={() => setShowRequestForm(!showRequestForm)}>
            <Plus className="h-4 w-4" />
            طلب سلفة جديدة
          </Button>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <Card>
            <CardHeader>
              <CardTitle>تقديم طلب سلفة جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">المبلغ المطلوب (ريال)</label>
                <Input
                  type="number"
                  placeholder="أدخل المبلغ..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">السبب</label>
                <Textarea
                  placeholder="اذكر سبب طلب السلفة..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleRequestAdvance} disabled={requestAdvanceMutation.isPending}>
                  تقديم الطلب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingDown className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">إجمالي السلف</p>
                <p className="text-2xl font-bold">{totalAdvances.toLocaleString()} ريال</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">المسدد</p>
                <p className="text-2xl font-bold">{Math.round(totalPaid).toLocaleString()} ريال</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">المتبقي</p>
                <p className="text-2xl font-bold">{Math.round(totalRemaining).toLocaleString()} ريال</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advances Table */}
        <Card>
          <CardHeader>
            <CardTitle>طلبات السلف</CardTitle>
            <CardDescription>جميع طلبات السلف المقدمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>تاريخ الطلب</TableHead>
                    <TableHead>السبب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الأقساط</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advanceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell className="font-bold">{request.amount} ريال</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell className="text-sm">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === "approved" ? (
                          <span className="text-sm">
                            {request.paidInstallments}/{request.installments}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
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
