export interface FaqResponse {
  id: string;
  number: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  updatedAt: string;
}
