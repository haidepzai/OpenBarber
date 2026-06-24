import type React from 'react';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
  profilePhoto?: string;
  salutation?: string;
  name?: string;
  shop?: Partial<Shop>;
}

export interface Shop {
  id: number;
  name: string;
  email?: string;
  description?: string;
  address?: string;
  city?: string;
  openingTime?: string;
  closingTime?: string;
  openingDays?: string[];
  rating?: number;
  reviews?: Review[];
  employees?: Employee[];
  services?: Service[];
  logoData?: string;
  pictures?: string[];
  latitude?: number;
  longitude?: number;
  logo?: string;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  shopId?: number;
  title?: string;
  targetAudience?: string;
  durationInMin?: number;
}

export interface Employee {
  id: number;
  name: string;
  shopId?: number;
  title?: string;
  picture?: string;
}

export interface Appointment {
  id: number;
  shopId?: number;
  shopName?: string;
  enterpriseId?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  serviceName?: string;
  employeeName?: string;
  status?: string;
  cancelCode?: string;
  confirmCode?: string;
  customerId?: number;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  reviewerName?: string;
  reviewerId?: number;
  shopId?: number;
  enterpriseId?: number;
  createdAt?: string;
}

export interface FilterState {
  searchTerm: string;
  openingTime: string;
  closingTime: string;
  openingDays: string[];
  rating: number;
  sortBy: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: (authRequest: unknown, customConfig?: unknown, rememberMe?: boolean) => Promise<unknown>;
  onSignUp: (registerRequest: unknown, customConfig?: unknown) => Promise<unknown>;
  deleteJWTTokenFromStorage: () => void;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  verifyHandler: (verifyRequest: unknown, customConfig?: unknown) => Promise<unknown>;
  userId: number;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  user: Partial<User>;
  setUser: React.Dispatch<React.SetStateAction<Partial<User>>>;
  role: string | null;
}

export interface SignupState {
  completedSteps: boolean[];
  currentStep: number;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  accountType: string | null;
  firstName: string;
  lastName: string;
  shopName: string;
  shopOwner: string;
  shopPhoneNumber: string;
  shopStreet: unknown;
  shopStreetText: string;
}

export interface SignupContextType {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  completedSteps: boolean[];
  setCompletedSteps: React.Dispatch<React.SetStateAction<boolean[]>>;
  close: () => void;
  data: SignupData;
  setData: React.Dispatch<React.SetStateAction<SignupData>>;
  signupState: SignupState;
  setSignupState: React.Dispatch<React.SetStateAction<SignupState>>;
  signupVisible: boolean;
  setSignupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  loginVisible: boolean;
  setLoginVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
