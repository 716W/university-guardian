import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  const claim = claims[currentIndex];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success bg-success/10 border-success/30";
    if (score >= 75) return "text-warning bg-warning/10 border-warning/30";
    return "text-destructive bg-destructive/10 border-destructive/30";
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

      {/* Split View */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Found Item Details */}
        <div className="col-span-3 rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-primary">Found Item Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Item</label>
              <p className="mt-0.5 text-sm font-medium text-card-foreground">{claim.item.title}</p>
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
            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground text-center">Item Photo Placeholder</p>
              <div className="mt-2 flex h-32 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                📷 No photo uploaded
              </div>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${getScoreColor(
              claim.matchScore
            )}`}
          >
            <span className="text-2xl font-bold">{claim.matchScore}%</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">Match</span>
          </div>
          <div className="mt-6 flex flex-col gap-2 w-full">
            <button className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
            <button className="flex items-center justify-center gap-2 rounded-md border-2 border-destructive bg-card px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        </div>

        {/* Claimant Proof */}
        <div className="col-span-3 rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-primary">Claimant Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <p className="mt-0.5 text-sm font-medium text-card-foreground">{claim.claimant.name}</p>
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
            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground text-center">Supporting Documents</p>
              <div className="mt-2 flex h-32 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                📎 Purchase receipt attached
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Claims;
