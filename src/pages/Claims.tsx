import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle, XCircle, ChevronLeft, Loader2, Eye, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type Claim = {
  id: string;
  itemName: string;
  claimantName: string;
  dateSubmitted: string;
  matchScore: number;
  status: "pending" | "approved" | "rejected";
  item: {
    title: string;
    description: string;
    location: string;
    date: string;
    foundBy: string;
    details: string;
  };
  claimant: {
    name: string;
    studentId: string;
    department: string;
    proof: string;
    contact: string;
  };
};

const claimsData: Claim[] = [
  {
    id: "CLM-001", itemName: "Samsung Galaxy S23", claimantName: "Ahmed Ali", dateSubmitted: "2026-02-08", matchScore: 95, status: "pending",
    item: { title: "Samsung Galaxy S23", description: "Black color, cracked screen protector, found near Engineering Faculty entrance.", location: "Engineering Faculty", date: "2026-02-06", foundBy: "Security Guard – Nabil", details: "Has a blue phone case with a sticker on the back. IMEI ending in 4829." },
    claimant: { name: "Ahmed Ali", studentId: "HU-2023-1045", department: "Computer Engineering", proof: "Provided IMEI number, described the blue case and sticker accurately. Showed purchase receipt from 2025.", contact: "+967 777 123 456" },
  },
  {
    id: "CLM-002", itemName: "Brown Leather Wallet", claimantName: "Khalid Nasser", dateSubmitted: "2026-02-07", matchScore: 78, status: "pending",
    item: { title: "Brown Leather Wallet", description: "Found under a table in the main cafeteria. Contains cash and cards.", location: "Cafeteria", date: "2026-02-07", foundBy: "Cleaning Staff – Amina", details: "Contains 3 bank cards, national ID, and approximately 15,000 YER." },
    claimant: { name: "Khalid Nasser", studentId: "HU-2022-0892", department: "Business Administration", proof: "Described wallet color correctly. Named one bank card issuer. Could not recall exact cash amount.", contact: "+967 733 456 789" },
  },
  {
    id: "CLM-003", itemName: "iPad Mini (Silver)", claimantName: "Hassan Abdo", dateSubmitted: "2026-02-06", matchScore: 88, status: "pending",
    item: { title: "iPad Mini (Silver)", description: "Found in Student Center, left on a charging station.", location: "Student Center", date: "2026-02-04", foundBy: "Student – Fatima Saleh", details: "Locked with passcode. Has a purple smart cover. Engraved name on the back." },
    claimant: { name: "Hassan Abdo", studentId: "HU-2024-0215", department: "Medicine", proof: "Correctly identified the engraved name and passcode. Provided Apple ID login proof.", contact: "+967 711 987 654" },
  },
  {
    id: "CLM-004", itemName: "Student ID Card", claimantName: "Sara Mohammed", dateSubmitted: "2026-02-05", matchScore: 92, status: "approved",
    item: { title: "Student ID Card", description: "Found on reading desk, second floor of main library.", location: "Main Library", date: "2026-02-05", foundBy: "Library Staff", details: "Name partially visible. Architecture department." },
    claimant: { name: "Sara Mohammed", studentId: "HU-2023-0672", department: "Architecture", proof: "Provided exact student ID number and described the card details.", contact: "+967 777 888 999" },
  },
  {
    id: "CLM-005", itemName: "Prescription Glasses", claimantName: "Ali Mansour", dateSubmitted: "2026-02-04", matchScore: 45, status: "rejected",
    item: { title: "Prescription Glasses", description: "Black frame prescription glasses in brown case.", location: "Medical Faculty", date: "2026-02-05", foundBy: "Noura Salem", details: "Strong prescription lenses, brand: Ray-Ban." },
    claimant: { name: "Ali Mansour", studentId: "HU-2024-0500", department: "Dentistry", proof: "Described glasses as brown frame (incorrect). Could not identify the case color.", contact: "+967 700 111 222" },
  },
];

const Claims = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success border-success bg-success/10";
    if (score >= 75) return "text-warning border-warning bg-warning/10";
    return "text-destructive border-destructive bg-destructive/10";
  };

  const handleDecision = (type: "approve" | "reject") => {
    if (!selectedClaim) return;
    setLoading(type);
    setTimeout(() => {
      setLoading(null);
      toast({
        title: type === "approve" ? "✅ Claim Approved!" : "❌ Claim Rejected",
        description: type === "approve"
          ? `Notification sent to ${selectedClaim.claimant.name}. Item ready for handover.`
          : `${selectedClaim.claimant.name} will be notified of the rejection.`,
      });
      setSelectedClaim(null);
    }, 1200);
  };

  // Detail View
  if (selectedClaim) {
    return (
      <DashboardLayout title="Claims Verification" subtitle="Review and verify ownership claims">
        {/* Back button */}
        <button onClick={() => setSelectedClaim(null)} className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Claims List
        </button>

        {/* Claim ID bar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-card mb-4">
          <span className="text-sm font-medium text-card-foreground">{selectedClaim.id} – {selectedClaim.itemName}</span>
          <StatusBadge status={selectedClaim.status} />
        </div>

        {/* Split View with Centered Score */}
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Centered Match Score */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 shadow-lg bg-card ${getScoreColor(selectedClaim.matchScore)}`}>
              <span className="text-3xl font-bold">{selectedClaim.matchScore}%</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Match</span>
            </div>
          </div>

          {/* Mobile Match Score */}
          <div className="flex lg:hidden justify-center">
            <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${getScoreColor(selectedClaim.matchScore)}`}>
              <span className="text-2xl font-bold">{selectedClaim.matchScore}%</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Match</span>
            </div>
          </div>

          {/* Found Item Details */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-sm font-bold text-primary">Found Item Details</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">📷 Item Photo</div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Item</label><p className="mt-0.5 text-sm font-semibold text-card-foreground">{selectedClaim.item.title}</p></div>
              <div><label className="text-xs font-medium text-muted-foreground">Description</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.item.description}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Location</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.item.location}</p></div>
                <div><label className="text-xs font-medium text-muted-foreground">Date Found</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.item.date}</p></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Found By</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.item.foundBy}</p></div>
              <div><label className="text-xs font-medium text-muted-foreground">Additional Details</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.item.details}</p></div>
            </div>
          </div>

          {/* Claimant Proof */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-sm font-bold text-primary">Claimant Proof</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">📎 Supporting Documents</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Name</label><p className="mt-0.5 text-sm font-semibold text-card-foreground">{selectedClaim.claimant.name}</p></div>
                <div><label className="text-xs font-medium text-muted-foreground">Student ID</label><p className="mt-0.5 text-sm font-mono text-card-foreground">{selectedClaim.claimant.studentId}</p></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Department</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.claimant.department}</p></div>
              <div><label className="text-xs font-medium text-muted-foreground">Contact</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.claimant.contact}</p></div>
              <div><label className="text-xs font-medium text-muted-foreground">Proof of Ownership</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.claimant.proof}</p></div>
            </div>
          </div>
        </div>

        {/* Decision Bar */}
        {selectedClaim.status === "pending" && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
            <button onClick={() => handleDecision("approve")} disabled={loading !== null}
              className="flex items-center justify-center gap-2 rounded-lg bg-success px-8 py-3 text-sm font-bold text-success-foreground hover:bg-success/90 transition-all disabled:opacity-50 min-w-[200px]">
              {loading === "approve" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />} Approve Claim
            </button>
            <button onClick={() => handleDecision("reject")} disabled={loading !== null}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-destructive bg-card px-8 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-all disabled:opacity-50 min-w-[200px]">
              {loading === "reject" ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />} Reject Claim
            </button>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Master List View
  return (
    <DashboardLayout title="Claims Management" subtitle="Review and manage item ownership claims">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Claim ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Claimant</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date Submitted</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Match Score</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {claimsData.map((claim) => (
                <tr key={claim.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{claim.id}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{claim.itemName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{claim.claimantName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{claim.dateSubmitted}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getScoreColor(claim.matchScore)}`}>
                      {claim.matchScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={claim.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedClaim(claim)}
                      className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Eye className="h-3.5 w-3.5" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">Showing {claimsData.length} claims</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Claims;
