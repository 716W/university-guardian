export interface Feedback {
    id: number;
    from: string;
    email: string;
    subject: string;
    message: string;
    rating: number;
    date: string;
    replied: boolean;
}
