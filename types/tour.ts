// types/tour.ts
export interface TourRequest {
  name: string;
  description: string;
  destination: string;
  price: number;
  durationDays: number;
  maxParticipants: number;
  status: TourStatus;
  startDate: string;
  endDate: string;
}

export interface TourResponse {
  id: string;
  name: string;
  description: string;
  destination: string;
  price: number;
  durationDays: number;
  maxParticipants: number;
  currentParticipants: number;
  status: TourStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourSummary {
  id: string;
  name: string;
  destination: string;
  price: number;
  durationDays: number;
  status: TourStatus;
  startDate: string;
}

export enum TourStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface SearchFilters {
  name?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minDays?: number;
  maxDays?: number;
  status?: TourStatus;
}