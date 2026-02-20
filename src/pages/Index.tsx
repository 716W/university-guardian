import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
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
  { name: "Electronics", value: 42, color: "hsl(263, 70%, 50%)" },
  { name: "Documents", value: 28, color: "hsl(142, 71%, 45%)" },
  { name: "Accessories", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Clothing", value: 12, color: "hsl(0, 72%, 51%)" },
];

const weeklyData = [
  { day: "Sat", lost: 5, found: 3 },
  { day: "Sun", lost: 8, found: 6 },
  { day: "Mon", lost: 12, found: 9 },
  { day: "Tue", lost: 7, found: 5 },
  { day: "Wed", lost: 10, found: 8 },
  { day: "Thu", lost: 6, found: 7 },
  { day: "Fri", lost: 3, found: 2 },
];

const recentActivity = [
  { id: 1, action: "New lost report filed", user: "Ahmed Ali", item: "Samsung Galaxy S23", time: "2 min ago", status: "lost" as const },
  { id: 2, action: "Claim approved", user: "Sara Mohammed", item: "Student ID Card", time: "15 min ago", status: "approved" as const },
  { id: 3, action: "Item handed over", user: "Omar Hassan", item: "Laptop Charger", time: "1 hour ago", status: "returned" as const },
  { id: 4, action: "New found report filed", user: "Fatima Saleh", item: "Engineering Textbook", time: "2 hours ago", status: "found" as const },
  { id: 5, action: "Claim pending review", user: "Khalid Nasser", item: "Wallet (Brown Leather)", time: "3 hours ago", status: "pending" as const },
  { id: 6, action: "New lost report filed", user: "Mona Abdulrahman", item: "USB Flash Drive 64GB", time: "4 hours ago", status: "lost" as const },
];

const Index = () => {
  return (
    <DashboardLayout title="Dashboard" subtitle="Lost & Found Overview">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Reports" value={127} change="+12 this week" changeType="neutral" icon={FileText} />
        <KPICard title="Pending Claims" value={34} change="-5 from yesterday" changeType="positive" icon={ShieldCheck} />
        <KPICard title="Recovery Rate" value="68%" change="+3.2% this month" changeType="positive" icon={TrendingUp} />
        <KPICard title="Total Users" value="2,847" change="+48 new users" changeType="positive" icon={Users} />
      </div>

      {/* Row 2: Charts - 50/50 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, index) => (
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
          <h3 className="mb-4 text-sm font-bold text-card-foreground">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 10%, 90%)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(240, 5%, 46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(250, 10%, 90%)", fontSize: "13px" }} />
              <Bar dataKey="lost" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} name="Lost" />
              <Bar dataKey="found" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} name="Found" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Recent Activity */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-card-foreground">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user} • {activity.item}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activity.status} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
