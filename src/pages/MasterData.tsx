import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const tabsData: Record<string, { label: string; items: string[] }> = {
  colleges: {
    label: "Colleges",
    items: [
      "College of Engineering",
      "College of Medicine",
      "College of Computer Science & IT",
      "College of Business Administration",
      "College of Law",
      "College of Architecture",
      "College of Pharmacy",
      "College of Education",
    ],
  },
  departments: {
    label: "Departments",
    items: [
      "Computer Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Business Administration",
      "Accounting",
      "General Medicine",
      "Pharmacy",
      "Architecture & Design",
    ],
  },
  locations: {
    label: "Locations",
    items: [
      "Engineering Faculty – Ground Floor",
      "Main Library",
      "IT Lab 1",
      "IT Lab 2",
      "IT Lab 3",
      "Cafeteria",
      "Student Center",
      "Parking Lot A",
      "Parking Lot B",
      "Lecture Hall A1",
      "Lecture Hall A2",
      "Admin Building",
      "Medical Faculty",
    ],
  },
  categories: {
    label: "Categories",
    items: [
      "Electronics",
      "Documents & IDs",
      "Accessories",
      "Clothing",
      "Books & Stationery",
      "Keys",
      "Bags & Wallets",
      "Other",
    ],
  },
};

const MasterData = () => {
  const [activeTab, setActiveTab] = useState("colleges");
  const data = tabsData[activeTab];

  return (
    <DashboardLayout title="Master Data" subtitle="Manage system lookups and reference data">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-card">
        {Object.entries(tabsData).map(([key, tab]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 rounded-lg border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            {data.label} ({data.items.length})
          </h3>
          <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
        <div className="divide-y divide-border">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-sm text-card-foreground">{item}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MasterData;
