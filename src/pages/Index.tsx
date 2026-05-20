import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetDashboardData } from "@/hooks/queries/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
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

const Index = () => {
  const { lang, isRTL } = useLanguage();

  const { data: dashboardData, isLoading, isError, error } = useGetDashboardData();

  if (isLoading) {
    return (
      <DashboardLayout title={t("dashboard", lang)} subtitle={t("dashboardSubtitle", lang)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <Skeleton className="mt-6 h-64 w-full rounded-xl" />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title={t("dashboard", lang)} subtitle={t("dashboardSubtitle", lang)}>
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
          <p>{error?.message || "Failed to load dashboard data."}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback to static data if anything is undefined
  const overview = dashboardData?.overview;

  // Format category data and assign random/fixed colors based on index
  const colors = ["hsl(263, 70%, 50%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];
  const dynamicChartData = dashboardData?.reportsByCategory?.map((cat, idx) => ({
    name: cat.categoryName,
    value: cat.count,
    color: colors[idx % colors.length]
  })) || [];

  const dynamicWeeklyData = dashboardData?.weeklyActivity?.map(day => ({
    day: day.day, // Note: You might need localization here depending on backend response
    lost: day.lostCount,
    found: day.foundCount
  })) || [];

  const dynamicRecentActivity = dashboardData?.recentActivity || [];

  return (
    <DashboardLayout title={t("dashboard", lang)} subtitle={t("dashboardSubtitle", lang)}>
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t("activeReports", lang)}
          value={overview?.activeReports || 0}
          change={overview?.activeReportsTrend || "0%"}
          changeType="neutral"
          icon={FileText}
        />
        <KPICard
          title={t("pendingClaims", lang)}
          value={overview?.pendingClaims || 0}
          change={overview?.pendingClaimsTrend || "0%"}
          changeType="positive"
          icon={ShieldCheck}
        />
        <KPICard
          title={t("recoveryRate", lang)}
          value={`${overview?.recoveryRate || 0}%`}
          change={overview?.recoveryRateTrend || "0%"}
          changeType="positive"
          icon={TrendingUp}
        />
        <KPICard
          title={t("totalUsers", lang)}
          value={overview?.totalUsers || 0}
          change={overview?.totalUsersTrend || "0"}
          changeType="positive"
          icon={Users}
        />
      </div>

      {/* Row 2: Charts - 50/50 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">{t("reportsByCategory", lang)}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={dynamicChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                {dynamicChartData.map((entry, index) => (
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
            <BarChart data={dynamicWeeklyData} barGap={4}>
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
          {dynamicRecentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activity.status as any} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
