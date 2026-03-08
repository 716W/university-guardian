import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const categoryData = [
  { name: "Electronics", nameAr: "إلكترونيات", value: 42, color: "hsl(263, 70%, 50%)" },
  { name: "Documents", nameAr: "مستندات", value: 28, color: "hsl(142, 71%, 45%)" },
  { name: "Accessories", nameAr: "إكسسوارات", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Clothing", nameAr: "ملابس", value: 12, color: "hsl(0, 72%, 51%)" },
];

const weeklyDataEN = [
  { day: "Sat", lost: 5, found: 3 },
  { day: "Sun", lost: 8, found: 6 },
  { day: "Mon", lost: 12, found: 9 },
  { day: "Tue", lost: 7, found: 5 },
  { day: "Wed", lost: 10, found: 8 },
  { day: "Thu", lost: 6, found: 7 },
  { day: "Fri", lost: 3, found: 2 },
];

const weeklyDataAR = [
  { day: "سبت", lost: 5, found: 3 },
  { day: "أحد", lost: 8, found: 6 },
  { day: "اثنين", lost: 12, found: 9 },
  { day: "ثلاثاء", lost: 7, found: 5 },
  { day: "أربعاء", lost: 10, found: 8 },
  { day: "خميس", lost: 6, found: 7 },
  { day: "جمعة", lost: 3, found: 2 },
];

const recentActivity = [
  { id: 1, action: { EN: "New lost report filed", AR: "تم تقديم بلاغ فقدان جديد" }, user: "Ahmed Ali", item: "Samsung Galaxy S23", time: { EN: "2 min ago", AR: "منذ دقيقتين" }, status: "lost" as const },
  { id: 2, action: { EN: "Claim approved", AR: "تم قبول المطالبة" }, user: "Sara Mohammed", item: { EN: "Student ID Card", AR: "بطاقة طالب" }, time: { EN: "15 min ago", AR: "منذ 15 دقيقة" }, status: "approved" as const },
  { id: 3, action: { EN: "Item handed over", AR: "تم تسليم العنصر" }, user: "Omar Hassan", item: { EN: "Laptop Charger", AR: "شاحن لابتوب" }, time: { EN: "1 hour ago", AR: "منذ ساعة" }, status: "returned" as const },
  { id: 4, action: { EN: "New found report filed", AR: "تم تقديم بلاغ عثور جديد" }, user: "Fatima Saleh", item: { EN: "Engineering Textbook", AR: "كتاب هندسة" }, time: { EN: "2 hours ago", AR: "منذ ساعتين" }, status: "found" as const },
  { id: 5, action: { EN: "Claim pending review", AR: "مطالبة قيد المراجعة" }, user: "Khalid Nasser", item: { EN: "Wallet (Brown Leather)", AR: "محفظة (جلد بني)" }, time: { EN: "3 hours ago", AR: "منذ 3 ساعات" }, status: "pending" as const },
  { id: 6, action: { EN: "New lost report filed", AR: "تم تقديم بلاغ فقدان جديد" }, user: "Mona Abdulrahman", item: { EN: "USB Flash Drive 64GB", AR: "فلاش USB 64GB" }, time: { EN: "4 hours ago", AR: "منذ 4 ساعات" }, status: "lost" as const },
];

const Index = () => {
  const { lang, isRTL } = useLanguage();
  const weeklyData = lang === "AR" ? weeklyDataAR : weeklyDataEN;
  const chartData = categoryData.map(d => ({ ...d, name: lang === "AR" ? d.nameAr : d.name }));

  return (
    <DashboardLayout title={t("dashboard", lang)} subtitle={t("dashboardSubtitle", lang)}>
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("activeReports", lang)} value={127} change={t("thisWeek", lang)} changeType="neutral" icon={FileText} />
        <KPICard title={t("pendingClaims", lang)} value={34} change={t("fromYesterday", lang)} changeType="positive" icon={ShieldCheck} />
        <KPICard title={t("recoveryRate", lang)} value="68%" change={t("thisMonth", lang)} changeType="positive" icon={TrendingUp} />
        <KPICard title={t("totalUsers", lang)} value="2,847" change={t("newUsers", lang)} changeType="positive" icon={Users} />
      </div>

      {/* Row 2: Charts - 50/50 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">{t("reportsByCategory", lang)}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(250, 10%, 90%)", fontSize: "13px" }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: "hsl(240, 5%, 46%)", fontSize: "12px" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">{t("weeklyActivity", lang)}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 10%, 90%)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 12 }} reversed={isRTL} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 12 }} orientation={isRTL ? "right" : "left"} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(250, 10%, 90%)", fontSize: "13px" }} />
              <Bar dataKey="lost" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} name={t("lost", lang)} />
              <Bar dataKey="found" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} name={t("found", lang)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Recent Activity */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-card-foreground">{t("recentActivity", lang)}</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{activity.action[lang]}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {typeof activity.item === "string" ? activity.item : activity.item[lang]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activity.status} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time[lang]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
