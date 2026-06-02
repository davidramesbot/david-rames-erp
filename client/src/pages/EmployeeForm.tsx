import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function EmployeeForm() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "new";

  const { data: employee } = trpc.employees.get.useQuery(
    isEdit ? { id: parseInt(id || "0") } : { id: 0 },
    { enabled: !!isEdit }
  );

  const createMutation = trpc.employees.create.useMutation();
  const updateMutation = trpc.employees.update.useMutation();

  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    nationalId: employee?.nationalId || "",
    position: employee?.position || "",
    department: employee?.department || "",
    monthlySalary: employee?.monthlySalary?.toString() || "",
    dailySalary: employee?.dailySalary?.toString() || "",
    hireDate: employee?.hireDate || "",
    address: employee?.address || "",
    emergencyContact: employee?.emergencyContact || "",
    emergencyPhone: employee?.emergencyPhone || "",
    bankAccount: employee?.bankAccount || "",
    insuranceNumber: employee?.insuranceNumber || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: parseInt(id || "0"),
          data: formData,
        });
        toast.success("تم تحديث بيانات الموظف بنجاح");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("تم إضافة الموظف بنجاح");
      }
      navigate("/employees");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/employees")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>البيانات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">الاسم الكامل *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">الرقم الوطني</label>
                <Input
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">العنوان</label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>بيانات التوظيف</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">المنصب</label>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">القسم</label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">تاريخ التوظيف</label>
                <Input
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">رقم التأمين</label>
                <Input
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>البيانات المالية</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">الراتب الشهري</label>
                <Input
                  name="monthlySalary"
                  type="number"
                  value={formData.monthlySalary}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">الراتب اليومي</label>
                <Input
                  name="dailySalary"
                  type="number"
                  value={formData.dailySalary}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">رقم الحساب البنكي</label>
                <Input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>جهات الاتصال الطارئة</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">جهة الاتصال</label>
                <Input
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate("/employees")}>
              إلغاء
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {isEdit ? "تحديث" : "إضافة"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
