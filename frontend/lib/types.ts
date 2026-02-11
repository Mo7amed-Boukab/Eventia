export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "PARTICIPANT";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}



export enum EventCategory {
  FORMATION = "Formation",
  WORKSHOP = "Workshop",
  CONFERENCE = "Conférence",
  NETWORKING = "Networking",
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELED = "CANCELED",
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  price: number;
  status: EventStatus;
  image?: string;
  participants?: number;
  maxParticipants?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}
