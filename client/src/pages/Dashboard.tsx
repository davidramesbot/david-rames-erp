import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { data: stats } = trpc.dashboard.stats.useQuery();

  const statCards = [
    {
      title: "إجمالي الموظفين",
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "إجمالي العملاء",
      value: stats?.totalClients || 0,
      icon: Building2,
      color: "bg-green-500",
    },
    {
      title: "الحاضرين اليوم",
      value: stats?.presentToday || 0,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "طلبات الإجازات المعلقة",
      value: stats?.pendingLeaves || 0,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">مرحباً بك في نظام إدارة الموارد البشرية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الحضور</CardTitle>
              <CardDescription>نسبة الحضور الشهرية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">معدل الحضور</span>
                    <span className="text-sm font-bold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">معدل الغياب</span>
                    <span className="text-sm font-bold">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">الإجازات</span>
                    <span className="text-sm font-bold">3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "3%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الموظفين بالأقسام</CardTitle>
              <CardDescription>عدد الموظفين في كل قسم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "التطوير", count: 12, color: "bg-blue-500" },
                  { name: "التسويق", count: 8, color: "bg-green-500" },
                  { name: "المبيعات", count: 15, color: "bg-purple-500" },
                  { name: "الموارد البشرية", count: 5, color: "bg-orange-500" },
                ].map((dept, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <span className="text-sm font-bold">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${dept.color} h-2 rounded-full`} style={{ width: `${(dept.count / 40) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الأخيرة</CardTitle>
            <CardDescription>آخر التحديثات في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "تم إضافة موظف جديد", user: "أحمد محمد", time: "منذ ساعة" },
                { action: "تم الموافقة على طلب إجازة", user: "فاطمة علي", time: "منذ ساعتين" },
                { action: "تم تحديث بيانات عميل", user: "محمد حسن", time: "منذ 3 ساعات" },
                { action: "تم حساب المرتبات الشهرية", user: "نظام", time: "منذ يوم" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
