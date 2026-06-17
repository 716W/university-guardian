import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle, XCircle, Loader2, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetAdminClaims, useGetClaimDetails, useApproveClaim, useRejectClaim } from "@/hooks/queries/useClaims";
import { ClaimListItem, ClaimDetails } from "@/types/claim";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const mapStatus = (status: number): "pending" | "approved" | "returned" | "rejected" => {
  if (status === 1) return "pending";
  if (status === 2) return "approved";
  if (status === 3) return "returned";
  if (status === 4) return "rejected";
  return "pending"; // Satisfy TS; actions check approvalStatus === 1 strictly
};

const Claims = () => {
  const { lang, isRTL } = useLanguage();
  
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const { data: claimsData, isLoading: isClaimsLoading } = useGetAdminClaims({ pageNumber: page, pageSize });
  const claimsList: ClaimListItem[] = Array.isArray(claimsData?.data) ? claimsData.data : [];
  
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const { data: detailsResponse, isLoading: isDetailsLoading } = useGetClaimDetails(selectedClaimId || "", !!selectedClaimId);
  
  // Merge list claim with details to ensure we don't lose matchScore and approvalStatus if omitted by details API
  const selectedListClaim = claimsList.find((c) => c.id === selectedClaimId);
  const selectedClaim = detailsResponse?.data ? { ...selectedListClaim, ...detailsResponse.data } as ClaimDetails : null;
  
  const approveMutation = useApproveClaim({ pageNumber: page, pageSize });
  const rejectMutation = useRejectClaim({ pageNumber: page, pageSize });

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground border-border bg-muted/10";
    if (score >= 80) return "text-success border-success bg-success/10";
    if (score >= 50) return "text-warning border-warning bg-warning/10";
    return "text-destructive border-destructive bg-destructive/10";
  };

  const handleDecision = (id: string, type: "approve" | "reject") => {
    const mutation = type === "approve" ? approveMutation : rejectMutation;
    
    mutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: type === "approve" ? "✅ " + t("claimApproved", lang) : "❌ " + t("claimRejected", lang),
          description: type === "approve"
            ? (lang === "AR" ? `تم اعتماد المطالبة بنجاح.` : `Claim has been successfully approved.`)
            : (lang === "AR" ? `تم رفض المطالبة.` : `Claim has been rejected.`),
        });
        if (selectedClaimId === id) {
          setSelectedClaimId(null);
        }
      },
      onError: (error: unknown) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error)?.message || "Something went wrong.",
        });
      }
    });
  };

  if (selectedClaimId) {
    const BackArrow = isRTL ? ArrowRight : ArrowLeft;
    const isActionLoading = approveMutation.isPending || rejectMutation.isPending;
    
    return (
      <DashboardLayout title={t("claimsSubtitle", lang)} subtitle={t("claimsSubtitle", lang)}>
        <button onClick={() => setSelectedClaimId(null)} className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <BackArrow className="h-4 w-4" /> {t("backToClaimsList", lang)}
        </button>

        {isDetailsLoading ? (
           <div className="flex justify-center items-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : selectedClaim ? (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-card mb-4">
              <span className="text-sm font-medium text-card-foreground">{selectedClaim.claimCode} – {selectedClaim.itemName}</span>
              <StatusBadge status={mapStatus(selectedClaim.approvalStatus)} />
            </div>

            <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 shadow-lg bg-card ${getScoreColor(selectedClaim.matchScore)}`}>
                  <span className="text-3xl font-bold">{selectedClaim.matchScore !== null ? `${selectedClaim.matchScore}%` : 'N/A'}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t("match", lang)}</span>
                </div>
              </div>

              <div className="flex lg:hidden justify-center">
                <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${getScoreColor(selectedClaim.matchScore)}`}>
                  <span className="text-2xl font-bold">{selectedClaim.matchScore !== null ? `${selectedClaim.matchScore}%` : 'N/A'}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t("match", lang)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-4 text-sm font-bold text-primary">{t("foundItemDetails", lang)}</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-3 flex justify-center">
                    {selectedClaim.itemImages && selectedClaim.itemImages.length > 0 ? (
                      <img src={`${API_BASE_URL}${selectedClaim.itemImages[0]}`} alt="Item" className="max-h-36 object-contain rounded-md" />
                    ) : (
                      <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground w-full">📷 {t("itemPhoto", lang)} ({lang === 'AR' ? 'غير متوفر' : 'N/A'})</div>
                    )}
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">{t("item", lang)}</label><p className="mt-0.5 text-sm font-semibold text-card-foreground">{selectedClaim.itemName || "N/A"}</p></div>
                  <div><label className="text-xs font-medium text-muted-foreground">{t("description", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.description || "N/A"}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.locationName || "N/A"}</p></div>
                    <div><label className="text-xs font-medium text-muted-foreground">{t("dateFound", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.dateReported ? new Date(selectedClaim.dateReported).toLocaleDateString() : "N/A"}</p></div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-4 text-sm font-bold text-primary">{t("claimantProof", lang)}</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex h-36 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">📎 {t("supportingDocs", lang)} ({lang === 'AR' ? 'غير متوفر' : 'N/A'})</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-muted-foreground">{t("name", lang)}</label><p className="mt-0.5 text-sm font-semibold text-card-foreground">{selectedClaim.claimantName || "N/A"}</p></div>
                    <div><label className="text-xs font-medium text-muted-foreground">{t("studentId", lang)}</label><p className="mt-0.5 text-sm font-mono text-card-foreground">{"N/A"}</p></div>
                  </div>
                  <div><label className="text-xs font-medium text-muted-foreground">{t("department", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{"N/A"}</p></div>
                  <div><label className="text-xs font-medium text-muted-foreground">{t("contact", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.claimantEmail || "N/A"}</p></div>
                  <div><label className="text-xs font-medium text-muted-foreground">{t("proofOfOwnership", lang)}</label><p className="mt-0.5 text-sm text-card-foreground">{selectedClaim.remarks || "N/A"}</p></div>
                </div>
              </div>
            </div>

            {selectedClaim.approvalStatus === 1 ? (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
                <button onClick={() => handleDecision(selectedClaim.id, "approve")} disabled={isActionLoading}
                  className="flex items-center justify-center gap-2 rounded-lg bg-success px-8 py-3 text-sm font-bold text-success-foreground hover:bg-success/90 transition-all disabled:opacity-50 min-w-[200px]">
                  {approveMutation.isPending && approveMutation.variables === selectedClaim.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />} {t("approveClaim", lang)}
                </button>
                <button onClick={() => handleDecision(selectedClaim.id, "reject")} disabled={isActionLoading}
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-destructive bg-card px-8 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 transition-all disabled:opacity-50 min-w-[200px]">
                  {rejectMutation.isPending && rejectMutation.variables === selectedClaim.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />} {t("rejectClaim", lang)}
                </button>
              </div>
            ) : (
              <div className="mt-6 text-center text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-border">
                {lang === 'AR' ? 'تمت معالجة هذه المطالبة مسبقاً.' : 'This claim has already been processed.'}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground py-10">Claim not found</div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t("claimsManagement", lang)} subtitle={t("claimsManagementSubtitle", lang)}>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thClaimId", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thItemName", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thClaimant", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thDateSubmitted", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thMatchScore", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thStatus", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thAction", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isClaimsLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td>
                </tr>
              ) : claimsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">No claims found.</td>
                </tr>
              ) : (
                claimsList.map((claim: ClaimListItem) => (
                  <tr key={claim.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{claim.claimCode}</td>
                    <td className="px-4 py-3 font-medium text-card-foreground">{claim.itemName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{claim.claimantName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(claim.claimDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getScoreColor(claim.matchScore)}`}>
                        {claim.matchScore !== null ? `${claim.matchScore}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={mapStatus(claim.approvalStatus)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedClaimId(claim.id)}
                          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                          <Eye className="h-3.5 w-3.5" /> {t("reviewClaim", lang)}
                        </button>
                        {claim.approvalStatus === 1 && (
                          <>
                            <button onClick={() => handleDecision(claim.id, "approve")} disabled={approveMutation.isPending || rejectMutation.isPending}
                              className="flex items-center gap-1.5 rounded-md bg-success px-3 py-1.5 text-xs font-medium text-success-foreground hover:bg-success/90 transition-colors disabled:opacity-50" title={t("approveClaim", lang)}>
                              {approveMutation.isPending && approveMutation.variables === claim.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            </button>
                            <button onClick={() => handleDecision(claim.id, "reject")} disabled={approveMutation.isPending || rejectMutation.isPending}
                              className="flex items-center gap-1.5 rounded-md border border-destructive bg-card px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50" title={t("rejectClaim", lang)}>
                              {rejectMutation.isPending && rejectMutation.variables === claim.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isClaimsLoading && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">{t("showing", lang)} {claimsList.length} {t("claims", lang).toLowerCase()}</p>
            {/* Pagination Controls can be added here */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Claims;
