import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import {
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  CheckCircle2,
  QrCode,
  Clock,
  ArrowRight,
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
  { name: "Electronics", value: 42, color: "hsl(224, 64%, 33%)" },
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

const urgentTasks = [
  { id: 1, text: "3 Pending Claims > 24 hours", priority: "high" },
  { id: 2, text: "5 Unverified Reports today", priority: "medium" },
  { id: 3, text: "2 Items awaiting handover", priority: "low" },
];

const quickActions = [
  { label: "Add Lost Item", icon: Plus, color: "bg-primary text-primary-foreground hover:bg-primary/90" },
  { label: "Verify Claim", icon: CheckCircle2, color: "bg-emerald-600 text-white hover:bg-emerald-700" },
  { label: "Scan QR Code", icon: QrCode, color: "bg-violet-600 text-white hover:bg-violet-700" },
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Active Reports" value={127} change="+12 this week" changeType="neutral" icon={FileText} />
        <KPICard title="Pending Claims" value={34} change="-5 from yesterday" changeType="positive" icon={ShieldCheck} />
        <KPICard title="Recovery Rate" value="68%" change="+3.2% this month" changeType="positive" icon={TrendingUp} />
        <KPICard title="Total Users" value="2,847" change="+48 new users" changeType="positive" icon={Users} />
      </div>

      {/* Action Center */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Urgent Tasks */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-blue-900/5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="text-sm font-bold text-card-foreground">Urgent Tasks</h3>
          </div>
          <div className="space-y-2.5">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">{task.text}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-blue-900/5">
          <h3 className="text-sm font-bold text-card-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`flex flex-col items-center gap-3 rounded-xl px-4 py-5 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${action.color}`}
              >
                <action.icon className="h-7 w-7" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-blue-900/5">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: "hsl(220, 9%, 46%)", fontSize: "12px" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-blue-900/5">
          <h3 className="mb-4 text-sm font-bold text-card-foreground">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(220, 13%, 91%)", fontSize: "13px" }} />
              <Bar dataKey="lost" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} name="Lost" />
              <Bar dataKey="found" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} name="Found" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-lg shadow-blue-900/5">
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
