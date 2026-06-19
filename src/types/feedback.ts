export interface Feedback {
    id: number;
    userName: string;
    userEmail: string;
    subject: string;
    message: string;
    rating: number;
    createdAt: string;
    isReplied: boolean;
    adminReply?: string;
}
