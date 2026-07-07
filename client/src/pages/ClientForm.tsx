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

export default function ClientForm() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== "new";

  const { data: client } = trpc.clients.get.useQuery(
    isEdit ? { id: parseInt(id || "0") } : { id: 0 },
    { enabled: !!isEdit }
  );

  const createMutation = trpc.clients.create.useMutation();
  const updateMutation = trpc.clients.update.useMutation();

  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    city: client?.city || "",
    country: "",
    taxId: "",
    contactPerson: "",
    contactPhone: "",
    notes: "",
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
        toast.success("تم تحديث بيانات العميل بنجاح");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("تم إضافة العميل بنجاح");
      }
      navigate("/clients");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">اسم العميل *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
              <div>
                <label className="text-sm font-medium">الرقم الضريبي</label>
                <Input
                  name="taxId"
                  value={formData.taxId}
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

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle>الموقع الجغرافي</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">المدينة</label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">الدولة</label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle>جهة الاتصال الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">اسم جهة الاتصال</label>
                <Input
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">ملاحظات</label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate("/clients")}>
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
