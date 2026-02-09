import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, FileSignature } from "lucide-react";

const Handover = () => {
  return (
    <DashboardLayout title="Handover & Documentation" subtitle="Document item return to rightful owner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Handover Form */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-semibold text-primary">Return Documentation</h3>
          <form className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Report Reference
              </label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>RPT-001 – Samsung Galaxy S23</option>
                <option>RPT-002 – Student ID Card</option>
                <option>RPT-003 – Laptop Charger (Dell)</option>
                <option>RPT-005 – Engineering Textbook</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Receiver Full Name
              </label>
              <input
                type="text"
                placeholder="e.g., Ahmed Ali Mohammed"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  ID Type
                </label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Student ID</option>
                  <option>National ID</option>
                  <option>Passport</option>
                  <option>Employee Badge</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., HU-2023-1045"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Handover Notes
              </label>
              <textarea
                rows={3}
                placeholder="Any additional notes about the handover..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Handover Date & Time
              </label>
              <input
                type="datetime-local"
                defaultValue="2026-02-09T10:30"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Complete Handover
            </button>
          </form>
        </div>

        {/* Signature & Upload */}
        <div className="space-y-6">
          {/* Digital Signature */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-primary">Digital Signature</h3>
            </div>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-background">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Sign here to confirm receipt
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click and drag to sign
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted">
                Clear Signature
              </button>
            </div>
          </div>

          {/* Upload ID Photo */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-primary">Upload ID Photo</h3>
            </div>
            <div className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors hover:border-primary/50 hover:bg-primary/5">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-card-foreground">
                  Drop image here or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Recent Handovers */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Recent Handovers</h3>
            <div className="space-y-2.5">
              {[
                { item: "Laptop Charger (Dell)", to: "Omar Hassan", date: "Feb 8, 2026" },
                { item: "Student ID Card", to: "Sara Mohammed", date: "Feb 7, 2026" },
                { item: "Engineering Textbook", to: "Mohammed Qasim", date: "Feb 5, 2026" },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
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
