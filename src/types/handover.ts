export interface HandoverRequest {
  receiverName: string;
  idType: number;
  idNumber: string;
  notes?: string;
  claimId?: number | string;
  reportId?: number | string;
}

export interface HandoverResponse {
  id: number | string;
  receiverName: string;
  idType: number;
  idNumber: string;
  notes?: string;
  claimId?: number | string;
  reportId?: number | string;
  handoverDate: string;
  digitalSignatureUrl?: string;
  idPhotoUrl?: string;
}
