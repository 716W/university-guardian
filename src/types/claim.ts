export interface ClaimListItem {
  id: string;
  claimCode: string;
  itemName: string;
  claimantName: string;
  claimDate: string;
  matchScore: number | null;
  approvalStatus: number;
}

export interface ClaimDetails extends ClaimListItem {
  remarks: string | null;
  description: string;
  locationName: string;
  dateReported: string;
  claimantEmail: string;
  itemImages: string[];
}
