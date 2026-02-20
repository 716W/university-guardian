import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, FileSignature, Package } from "lucide-react";
import { useState } from "react";

const itemOptions = [
  { id: "RPT-001", title: "Samsung Galaxy S23", emoji: "📱" },
  { id: "RPT-002", title: "Student ID Card", emoji: "📄" },
  { id: "RPT-003", title: "Laptop Charger (Dell)", emoji: "🔌" },
  { id: "RPT-005", title: "Engineering Textbook", emoji: "📚" },
];

const Handover = () => {
  const [selectedItem, setSelectedItem] = useState(itemOptions[0].id);
  const currentItem = itemOptions.find((i) => i.id === selectedItem) || itemOptions[0];

  return (
    <DashboardLayout title="Handover & Documentation" subtitle="Document item return to rightful owner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Side - 60% (3/5) */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-bold text-primary">Return Documentation</h3>
          <form className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Select Report Reference
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {itemOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.id} – {opt.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Receiver Full Name</label>
                <input type="text" placeholder="e.g., Ahmed Ali" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">ID Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Student ID</option>
                  <option>National ID</option>
                  <option>Passport</option>
                  <option>Employee Badge</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">ID Number</label>
                <input type="text" placeholder="e.g., HU-2023-1045" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Handover Notes</label>
              <textarea rows={2} placeholder="Any additional notes..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            {/* Side-by-side Signature & Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Digital Signature */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-primary" />
                  <label className="text-xs font-medium text-muted-foreground">Digital Signature</label>
                </div>
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-background">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Click and drag to sign</p>
                  </div>
                </div>
                <button type="button" className="mt-2 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground hover:bg-muted">
                  Clear
                </button>
              </div>

              {/* Upload ID Photo */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <label className="text-xs font-medium text-muted-foreground">Upload ID Photo</label>
                </div>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors hover:border-primary/50 hover:bg-primary/5">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-1 text-xs font-medium text-card-foreground">Drop or click</p>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors mt-2">
              Complete Handover
            </button>
          </form>
        </div>

        {/* Right Side - 40% (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Selected Item Summary */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-card-foreground">Selected Item</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-3xl">
                {currentItem.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-card-foreground">{currentItem.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{currentItem.id}</p>
                <span className="inline-flex mt-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-semibold text-warning border border-warning/20">
                  Awaiting Handover
                </span>
              </div>
            </div>
          </div>

          {/* Recent Handovers */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-sm font-bold text-card-foreground">Recent Handovers</h3>
            <div className="space-y-2.5">
              {[
                { item: "Laptop Charger (Dell)", to: "Omar Hassan", date: "Feb 8, 2026" },
                { item: "Student ID Card", to: "Sara Mohammed", date: "Feb 7, 2026" },
                { item: "Engineering Textbook", to: "Mohammed Qasim", date: "Feb 5, 2026" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{h.item}</p>
                    <p className="text-xs text-muted-foreground">To: {h.to}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Handover;
