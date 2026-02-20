import { DashboardLayout } from "@/components/DashboardLayout";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const claims = [
  {
    id: "CLM-001",
    matchScore: 95,
    item: {
      title: "Samsung Galaxy S23",
      description: "Black color, cracked screen protector, found near Engineering Faculty entrance.",
      location: "Engineering Faculty",
      date: "2026-02-06",
      foundBy: "Security Guard – Nabil",
      details: "Has a blue phone case with a sticker on the back. IMEI ending in 4829.",
    },
    claimant: {
      name: "Ahmed Ali",
      studentId: "HU-2023-1045",
      department: "Computer Engineering",
      proof: "Provided IMEI number, described the blue case and sticker accurately. Showed purchase receipt from 2025.",
      contact: "+967 777 123 456",
    },
  },
  {
    id: "CLM-002",
    matchScore: 78,
    item: {
      title: "Brown Leather Wallet",
      description: "Found under a table in the main cafeteria. Contains cash and cards.",
      location: "Cafeteria",
      date: "2026-02-07",
      foundBy: "Cleaning Staff – Amina",
      details: "Contains 3 bank cards, national ID, and approximately 15,000 YER.",
    },
    claimant: {
      name: "Khalid Nasser",
      studentId: "HU-2022-0892",
      department: "Business Administration",
      proof: "Described wallet color correctly. Named one bank card issuer. Could not recall exact cash amount.",
      contact: "+967 733 456 789",
    },
  },
  {
    id: "CLM-003",
    matchScore: 88,
    item: {
      title: "iPad Mini (Silver)",
      description: "Found in Student Center, left on a charging station.",
      location: "Student Center",
      date: "2026-02-04",
      foundBy: "Student – Fatima Saleh",
      details: "Locked with passcode. Has a purple smart cover. Engraved name on the back.",
    },
    claimant: {
      name: "Hassan Abdo",
      studentId: "HU-2024-0215",
      department: "Medicine",
      proof: "Correctly identified the engraved name and passcode. Provided Apple ID login proof.",
      contact: "+967 711 987 654",
    },
  },
];

const Claims = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const claim = claims[currentIndex];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success border-success bg-success/10";
    if (score >= 75) return "text-warning border-warning bg-warning/10";
    return "text-destructive border-destructive bg-destructive/10";
  };

  const handleDecision = (type: "approve" | "reject") => {
    setLoading(type);
    setTimeout(() => {
      setLoading(null);
      toast({
        title: type === "approve" ? "✅ Claim Approved!" : "❌ Claim Rejected",
        description: type === "approve"
          ? `Notification sent to ${claim.claimant.name}. Item ready for handover.`
          : `${claim.claimant.name} will be notified of the rejection.`,
      });
    }, 1200);
  };

  return (
    <DashboardLayout title="Claims Verification" subtitle="Review and verify ownership claims">
      {/* Navigation */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-card">
        <span className="text-sm text-muted-foreground">
          Claim {currentIndex + 1} of {claims.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-card-foreground">{claim.id}</span>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="rounded-md border border-input p-1.5 hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(claims.length - 1, currentIndex + 1))}
            disabled={currentIndex === claims.length - 1}
            className="rounded-md border border-input p-1.5 hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Split View with Centered Score */}
      <div className="mt-4 relative grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Centered Match Score - overlapping both cards */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 shadow-lg bg-card ${getScoreColor(claim.matchScore)}`}>
            <span className="text-3xl font-bold">{claim.matchScore}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Match</span>
          </div>
        </div>

        {/* Mobile Match Score */}
        <div className="flex lg:hidden justify-center">
          <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${getScoreColor(claim.matchScore)}`}>
            <span className="text-2xl font-bold">{claim.matchScore}%</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">Match</span>
          </div>
        </div>

        {/* Found Item Details */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-primary">Found Item Details</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                📷 Item Photo
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Item</label>
              <p className="mt-0.5 text-sm font-semibold text-card-foreground">{claim.item.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.item.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <p className="mt-0.5 text-sm text-card-foreground">{claim.item.location}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Date Found</label>
                <p className="mt-0.5 text-sm text-card-foreground">{claim.item.date}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Found By</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.item.foundBy}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Additional Details</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.item.details}</p>
            </div>
          </div>
        </div>

        {/* Claimant Proof */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-sm font-bold text-primary">Claimant Proof</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                📎 Supporting Documents
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <p className="mt-0.5 text-sm font-semibold text-card-foreground">{claim.claimant.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Student ID</label>
                <p className="mt-0.5 text-sm font-mono text-card-foreground">{claim.claimant.studentId}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Department</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.claimant.department}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contact</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.claimant.contact}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Proof of Ownership</label>
              <p className="mt-0.5 text-sm text-card-foreground">{claim.claimant.proof}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
        <button
          onClick={() => handleDecision("approve")}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-lg bg-success px-8 py-3 text-sm font-bold text-success-foreground hover:bg-success/90 transition-all disabled:opacity-50 min-w-[200px]"
        >
          {loading === "approve" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
          Approve Claim
        </button>
        <button
          onClick={() => handleDecision("reject")}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-destructive bg-card px-8 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-all disabled:opacity-50 min-w-[200px]"
        >
          {loading === "reject" ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />}
          Reject Claim
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Claims;
