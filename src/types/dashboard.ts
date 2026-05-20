export interface DashboardOverview {
  activeReports: number;
  activeReportsTrend: string;
  pendingClaims: number;
  pendingClaimsTrend: string;
  recoveryRate: number;
  recoveryRateTrend: string;
  totalUsers: number;
  totalUsersTrend: string;
}

export interface CategoryReport {
  categoryName: string;
  count: number;
}

export interface WeeklyActivity {
  day: string;
  lostCount: number;
  foundCount: number;
}

export interface RecentActivity {
  action: string;
  details: string;
  status: string;
  timeAgo: string;
}

export interface DashboardData {
  overview: DashboardOverview;
  reportsByCategory: CategoryReport[];
  weeklyActivity: WeeklyActivity[];
  recentActivity: RecentActivity[];
}
