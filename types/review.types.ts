export interface IReview {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
  doctor?: {
    id: string;
    name?: string;
    averageRating?: number;
  };
  patient?: {
    id: string;
    name?: string;
  };
}
