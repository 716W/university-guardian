type Lang = "EN" | "AR";

const translations = {
  // Common actions
  search: { EN: "Search", AR: "بحث" },
  export: { EN: "Export", AR: "تصدير" },
  cancel: { EN: "Cancel", AR: "إلغاء" },
  save: { EN: "Save", AR: "حفظ" },
  saveChanges: { EN: "Save Changes", AR: "حفظ التغييرات" },
  delete: { EN: "Delete", AR: "حذف" },
  edit: { EN: "Edit", AR: "تعديل" },
  view: { EN: "View", AR: "عرض" },
  add: { EN: "Add", AR: "إضافة" },
  apply: { EN: "Apply", AR: "تطبيق" },
  clear: { EN: "Clear", AR: "مسح" },
  close: { EN: "Close", AR: "إغلاق" },
  previous: { EN: "Previous", AR: "السابق" },
  next: { EN: "Next", AR: "التالي" },
  showing: { EN: "Showing", AR: "عرض" },
  of: { EN: "of", AR: "من" },
  selected: { EN: "selected", AR: "محدد" },
  reply: { EN: "Reply", AR: "رد" },
  replied: { EN: "Replied", AR: "تم الرد" },
  awaitingReply: { EN: "Awaiting Reply", AR: "بانتظار الرد" },

  // Navigation
  dashboard: { EN: "Dashboard", AR: "لوحة التحكم" },
  reports: { EN: "Reports", AR: "البلاغات" },
  claims: { EN: "Claims", AR: "المطالبات" },
  handover: { EN: "Handover", AR: "التسليم" },
  users: { EN: "Users", AR: "المستخدمين" },
  masterData: { EN: "Master Data", AR: "البيانات الرئيسية" },
  auditLogs: { EN: "Audit Logs", AR: "سجل العمليات" },
  feedback: { EN: "Feedback", AR: "الملاحظات" },
  settings: { EN: "Settings", AR: "الإعدادات" },

  // Nav groups
  navMain: { EN: "MAIN", AR: "الرئيسية" },
  navOperations: { EN: "OPERATIONS", AR: "العمليات" },
  navSystem: { EN: "SYSTEM", AR: "النظام" },
  navSupport: { EN: "SUPPORT", AR: "الدعم" },

  // Header
  searchPlaceholder: { EN: "Search reports, claims, users...", AR: "ابحث في التقارير، المطالبات، المستخدمين..." },
  myProfile: { EN: "My Profile", AR: "ملفي الشخصي" },
  logout: { EN: "Logout", AR: "تسجيل الخروج" },
  notifications: { EN: "Notifications", AR: "الإشعارات" },
  viewAllNotifications: { EN: "View All Notifications", AR: "عرض جميع الإشعارات" },
  collapse: { EN: "Collapse", AR: "طي" },

  // Sidebar
  hadramoutUniv: { EN: "Hadramout Univ.", AR: "جامعة حضرموت" },
  lostAndFound: { EN: "Lost & Found", AR: "المفقودات والموجودات" },
  adminManager: { EN: "Admin Manager", AR: "مدير النظام" },
  superAdmin: { EN: "Super Admin", AR: "مشرف عام" },

  // Dashboard
  dashboardSubtitle: { EN: "Lost & Found Overview", AR: "نظرة عامة على المفقودات والموجودات" },
  activeReports: { EN: "Active Reports", AR: "البلاغات النشطة" },
  pendingClaims: { EN: "Pending Claims", AR: "المطالبات المعلقة" },
  recoveryRate: { EN: "Recovery Rate", AR: "معدل الاسترداد" },
  totalUsers: { EN: "Total Users", AR: "إجمالي المستخدمين" },
  thisWeek: { EN: "+12 this week", AR: "+12 هذا الأسبوع" },
  fromYesterday: { EN: "-5 from yesterday", AR: "-5 من الأمس" },
  thisMonth: { EN: "+3.2% this month", AR: "+3.2% هذا الشهر" },
  newUsers: { EN: "+48 new users", AR: "+48 مستخدم جديد" },
  reportsByCategory: { EN: "Reports by Category", AR: "البلاغات حسب الفئة" },
  weeklyActivity: { EN: "Weekly Activity", AR: "النشاط الأسبوعي" },
  recentActivity: { EN: "Recent Activity", AR: "النشاط الأخير" },

  // Reports page
  reportsSubtitle: { EN: "Manage lost and found item reports", AR: "إدارة بلاغات المفقودات والموجودات" },
  searchReports: { EN: "Search reports...", AR: "ابحث في البلاغات..." },
  allStatus: { EN: "All Status", AR: "جميع الحالات" },
  lost: { EN: "Lost", AR: "مفقود" },
  found: { EN: "Found", AR: "موجود" },
  allCategories: { EN: "All Categories", AR: "جميع الفئات" },
  moreFilters: { EN: "More Filters", AR: "فلاتر إضافية" },
  advancedFilters: { EN: "Advanced Filters", AR: "فلاتر متقدمة" },
  viewDetails: { EN: "View Details", AR: "عرض التفاصيل" },
  changeStatus: { EN: "Change Status", AR: "تغيير الحالة" },
  editReport: { EN: "Edit Report", AR: "تعديل البلاغ" },
  deleteReport: { EN: "Delete Report", AR: "حذف البلاغ" },
  clearAll: { EN: "Clear All", AR: "مسح الكل" },
  applyFilters: { EN: "Apply Filters", AR: "تطبيق الفلاتر" },
  highMatch: { EN: "High Match", AR: "تطابق عالي" },
  potentialMatch: { EN: "This item has potential matches in the system", AR: "هذا العنصر لديه تطابقات محتملة في النظام" },

  // Table headers
  thId: { EN: "ID", AR: "المعرف" },
  thItem: { EN: "Item", AR: "العنصر" },
  thCategory: { EN: "Category", AR: "الفئة" },
  thLocation: { EN: "Location", AR: "الموقع" },
  thReporter: { EN: "Reporter", AR: "المُبلِّغ" },
  thDate: { EN: "Date", AR: "التاريخ" },
  thStatus: { EN: "Status", AR: "الحالة" },
  thActions: { EN: "Actions", AR: "الإجراءات" },
  thName: { EN: "Name", AR: "الاسم" },
  thEmail: { EN: "Email", AR: "البريد الإلكتروني" },
  thRole: { EN: "Role", AR: "الدور" },
  thDepartment: { EN: "Department", AR: "القسم" },
  thJoined: { EN: "Joined", AR: "تاريخ الانضمام" },
  thTimestamp: { EN: "Timestamp", AR: "الطابع الزمني" },
  thAdmin: { EN: "Admin", AR: "المشرف" },
  thAction: { EN: "Action", AR: "الإجراء" },
  thTarget: { EN: "Target", AR: "الهدف" },
  thIpAddress: { EN: "IP Address", AR: "عنوان IP" },
  thClaimId: { EN: "Claim ID", AR: "معرف المطالبة" },
  thItemName: { EN: "Item Name", AR: "اسم العنصر" },
  thClaimant: { EN: "Claimant", AR: "المُطالب" },
  thDateSubmitted: { EN: "Date Submitted", AR: "تاريخ التقديم" },
  thMatchScore: { EN: "Match Score", AR: "درجة التطابق" },

  // Users page
  usersSubtitle: { EN: "Manage students and staff accounts", AR: "إدارة حسابات الطلاب والموظفين" },
  searchUsers: { EN: "Search users...", AR: "ابحث في المستخدمين..." },
  allRoles: { EN: "All Roles", AR: "جميع الأدوار" },
  addUser: { EN: "Add User", AR: "إضافة مستخدم" },
  addNewUser: { EN: "Add New User", AR: "إضافة مستخدم جديد" },
  editProfile: { EN: "Edit Profile", AR: "تعديل الملف" },
  changeRole: { EN: "Change Role", AR: "تغيير الدور" },
  banUser: { EN: "Ban User", AR: "حظر المستخدم" },
  permanentlyBan: { EN: "Permanently Ban", AR: "حظر دائم" },
  resetPassword: { EN: "Reset Password", AR: "إعادة تعيين كلمة المرور" },
  userProfile: { EN: "User Profile", AR: "ملف المستخدم" },
  dangerZone: { EN: "Danger Zone", AR: "منطقة الخطر" },
  fullName: { EN: "Full Name", AR: "الاسم الكامل" },
  email: { EN: "Email", AR: "البريد الإلكتروني" },
  role: { EN: "Role", AR: "الدور" },
  department: { EN: "Department", AR: "القسم" },
  student: { EN: "Student", AR: "طالب" },
  staff: { EN: "Staff", AR: "موظف" },
  admin: { EN: "Admin", AR: "مشرف" },
  updateRole: { EN: "Update Role", AR: "تحديث الدور" },
  exportComplete: { EN: "Export Complete", AR: "اكتمل التصدير" },
  usersExported: { EN: "Users data exported as CSV.", AR: "تم تصدير بيانات المستخدمين كملف CSV." },

  // Claims page
  claimsSubtitle: { EN: "Review and verify ownership claims", AR: "مراجعة والتحقق من مطالبات الملكية" },
  claimsManagement: { EN: "Claims Management", AR: "إدارة المطالبات" },
  claimsManagementSubtitle: { EN: "Review and manage item ownership claims", AR: "مراجعة وإدارة مطالبات ملكية العناصر" },
  reviewClaim: { EN: "Review", AR: "مراجعة" },
  backToClaimsList: { EN: "Back to Claims List", AR: "العودة لقائمة المطالبات" },
  foundItemDetails: { EN: "Found Item Details", AR: "تفاصيل العنصر الموجود" },
  claimantProof: { EN: "Claimant Proof", AR: "إثبات المُطالب" },
  match: { EN: "Match", AR: "تطابق" },
  approveClaim: { EN: "Approve Claim", AR: "قبول المطالبة" },
  rejectClaim: { EN: "Reject Claim", AR: "رفض المطالبة" },
  claimApproved: { EN: "Claim Approved!", AR: "تم قبول المطالبة!" },
  claimRejected: { EN: "Claim Rejected", AR: "تم رفض المطالبة" },
  itemPhoto: { EN: "Item Photo", AR: "صورة العنصر" },
  supportingDocs: { EN: "Supporting Documents", AR: "المستندات الداعمة" },
  item: { EN: "Item", AR: "العنصر" },
  description: { EN: "Description", AR: "الوصف" },
  dateFound: { EN: "Date Found", AR: "تاريخ العثور" },
  foundBy: { EN: "Found By", AR: "وجده" },
  additionalDetails: { EN: "Additional Details", AR: "تفاصيل إضافية" },
  name: { EN: "Name", AR: "الاسم" },
  studentId: { EN: "Student ID", AR: "رقم الطالب" },
  contact: { EN: "Contact", AR: "التواصل" },
  proofOfOwnership: { EN: "Proof of Ownership", AR: "إثبات الملكية" },

  // Handover page
  handoverSubtitle: { EN: "Document item return to rightful owner", AR: "توثيق إعادة العناصر لأصحابها" },
  returnDocumentation: { EN: "Return Documentation", AR: "توثيق الإرجاع" },
  selectReportRef: { EN: "Select Report Reference", AR: "اختر مرجع البلاغ" },
  receiverFullName: { EN: "Receiver Full Name", AR: "اسم المستلم الكامل" },
  idType: { EN: "ID Type", AR: "نوع الهوية" },
  idNumber: { EN: "ID Number", AR: "رقم الهوية" },
  handoverNotes: { EN: "Handover Notes", AR: "ملاحظات التسليم" },
  digitalSignature: { EN: "Digital Signature", AR: "التوقيع الرقمي" },
  uploadIdPhoto: { EN: "Upload ID Photo", AR: "رفع صورة الهوية" },
  clickDragSign: { EN: "Click and drag to sign", AR: "انقر واسحب للتوقيع" },
  dropOrClick: { EN: "Drop or click", AR: "أسقط أو انقر" },
  completeHandover: { EN: "Complete Handover", AR: "إتمام التسليم" },
  selectedItem: { EN: "Selected Item", AR: "العنصر المحدد" },
  awaitingHandover: { EN: "Awaiting Handover", AR: "بانتظار التسليم" },
  recentHandovers: { EN: "Recent Handovers", AR: "عمليات التسليم الأخيرة" },
  studentIdOption: { EN: "Student ID", AR: "بطاقة طالب" },
  nationalId: { EN: "National ID", AR: "هوية وطنية" },
  passport: { EN: "Passport", AR: "جواز سفر" },
  employeeBadge: { EN: "Employee Badge", AR: "بطاقة موظف" },

  // Audit logs
  auditLogsSubtitle: { EN: "Security and activity trail", AR: "سجل الأمان والنشاط" },
  searchLogs: { EN: "Search logs...", AR: "ابحث في السجلات..." },
  exportLogs: { EN: "Export Logs", AR: "تصدير السجلات" },
  logEntries: { EN: "log entries", AR: "سجل" },

  // Feedback
  feedbackSubtitle: { EN: "User messages and suggestions inbox", AR: "صندوق رسائل واقتراحات المستخدمين" },

  // Settings
  settingsSubtitle: { EN: "System configuration and preferences", AR: "إعدادات النظام والتفضيلات" },
  generalSettings: { EN: "General Settings", AR: "الإعدادات العامة" },
  systemName: { EN: "System Name", AR: "اسم النظام" },
  adminEmail: { EN: "Admin Email", AR: "بريد المشرف" },
  defaultLanguage: { EN: "Default Language", AR: "اللغة الافتراضية" },
  timezone: { EN: "Timezone", AR: "المنطقة الزمنية" },
  notificationSettings: { EN: "Notifications", AR: "الإشعارات" },
  claimSettings: { EN: "Claim Settings", AR: "إعدادات المطالبات" },
  security: { EN: "Security", AR: "الأمان" },
  saveSettings: { EN: "Save Settings", AR: "حفظ الإعدادات" },
  autoExpire: { EN: "Auto-expire unclaimed items (days)", AR: "انتهاء صلاحية العناصر غير المطالب بها (أيام)" },
  minMatchScore: { EN: "Minimum match score for auto-flagging (%)", AR: "الحد الأدنى لدرجة التطابق للتنبيه التلقائي (%)" },
  maxClaimsPerMonth: { EN: "Maximum claims per user per month", AR: "الحد الأقصى للمطالبات لكل مستخدم شهرياً" },
  sessionTimeout: { EN: "Session Timeout (minutes)", AR: "مهلة الجلسة (دقائق)" },
  auditRetention: { EN: "Audit Log Retention (days)", AR: "مدة الاحتفاظ بسجل العمليات (أيام)" },

  // Master Data
  masterDataSubtitle: { EN: "Manage system lookups and reference data", AR: "إدارة البيانات المرجعية للنظام" },
  colleges: { EN: "Colleges", AR: "الكليات" },
  departments: { EN: "Departments", AR: "الأقسام" },
  locations: { EN: "Locations", AR: "المواقع" },
  categories: { EN: "Categories", AR: "الفئات" },
  addNew: { EN: "Add New", AR: "إضافة جديد" },

  // Status badges
  statusLost: { EN: "Lost", AR: "مفقود" },
  statusFound: { EN: "Found", AR: "موجود" },
  statusClaimed: { EN: "Claimed", AR: "مُطالب به" },
  statusReturned: { EN: "Returned", AR: "مُسترجع" },
  statusActive: { EN: "Active", AR: "نشط" },
  statusBanned: { EN: "Banned", AR: "محظور" },
  statusPending: { EN: "Pending", AR: "قيد الانتظار" },
  statusApproved: { EN: "Approved", AR: "مقبول" },
  statusRejected: { EN: "Rejected", AR: "مرفوض" },

  // Login
  adminLogin: { EN: "Admin Login", AR: "تسجيل دخول المشرف" },
  loginSubtitle: { EN: "Please enter your credentials to continue", AR: "يرجى إدخال بيانات الاعتماد للمتابعة" },
  emailAddress: { EN: "Email Address", AR: "البريد الإلكتروني" },
  password: { EN: "Password", AR: "كلمة المرور" },
  rememberMe: { EN: "Remember me", AR: "تذكرني" },
  forgotPassword: { EN: "Forgot Password?", AR: "نسيت كلمة المرور؟" },
  signIn: { EN: "Sign In", AR: "تسجيل الدخول" },
  signingIn: { EN: "Signing in…", AR: "جاري تسجيل الدخول..." },
  welcomeBack: { EN: "Welcome back!", AR: "مرحباً بعودتك!" },
  redirecting: { EN: "Redirecting to dashboard...", AR: "جاري التوجيه إلى لوحة التحكم..." },
  lostFoundSystem: { EN: "Lost & Found System", AR: "نظام المفقودات والموجودات" },
  secureAdminAccess: { EN: "Secure Admin Access", AR: "وصول آمن للمشرفين" },
  allRightsReserved: { EN: "© 2026 Hadramout University. All rights reserved.", AR: "© 2026 جامعة حضرموت. جميع الحقوق محفوظة." },

  // Notification items
  notifNewClaim: { EN: "New Claim Submitted", AR: "تم تقديم مطالبة جديدة" },
  notifReportMatched: { EN: "Report Matched", AR: "تم تطابق بلاغ" },
  notifHandoverCompleted: { EN: "Handover Completed", AR: "اكتمل التسليم" },

  // Validation
  emailRequired: { EN: "Email is required", AR: "البريد الإلكتروني مطلوب" },
  validEmail: { EN: "Enter a valid email address", AR: "أدخل بريد إلكتروني صالح" },
  passwordRequired: { EN: "Password is required", AR: "كلمة المرور مطلوبة" },
  passwordMinLength: { EN: "Password must be at least 6 characters", AR: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
  titleRequired: { EN: "Title is required", AR: "العنوان مطلوب" },
  locationRequired: { EN: "Location is required", AR: "الموقع مطلوب" },
  nameRequired: { EN: "Name is required", AR: "الاسم مطلوب" },
  invalidEmail: { EN: "Invalid email", AR: "بريد إلكتروني غير صالح" },

  // Profile modal
  lastLogin: { EN: "Last Login", AR: "آخر تسجيل دخول" },
  todayAt: { EN: "Today, 09:42 AM", AR: "اليوم، 09:42 صباحاً" },
  itAdministration: { EN: "IT Administration", AR: "إدارة تقنية المعلومات" },

  // Report ID prefix
  reportId: { EN: "Report ID", AR: "معرف البلاغ" },
  title: { EN: "Title", AR: "العنوان" },

  // Misc
  to: { EN: "To", AR: "إلى" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.["EN"] ?? key;
}

export default translations;
