import { UserStatus } from "./user.type";

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export type DoctorGenderValue = "MALE" | "FEMALE" | "OTHER";

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    experience: number;
    gender: DoctorGenderValue;
    appointmentFee: number;
    qualification: string;
    designation: string;
    currentWorkingPlace: string;
  };
  specialties: string[];
}

export interface IUpdateDoctorPayload {
  doctor?: Partial<Omit<ICreateDoctorPayload["doctor"], "email">>;
  specialties: string[];
}

export interface IDoctor {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber: string;
  experience?: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  createdAt: Date;
  user: {
    status: UserStatus;
  };
  specialties: Array<{
    specialtyId: string;
    doctorId: string;
    specialty: {
      id: string;
      title: string;
      icon: string;
    };
  }>;
}
