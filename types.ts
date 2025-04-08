export interface Medication {
  id: string;
  pillName: string;
  dosageAmount?: number;
  unit?: string;
  imageUrl?: string;
  reminderTimes?: { seconds: number }[]; // timestamp for firebase
  instructions?: string;
  expirationDate?: string; // YYYY-MM-DD format
  refillsLeft?: number;
  beforeMeal?: boolean;
  withFood?: boolean;
  afterMeal?: boolean;
  createdAt?: { seconds: number }; 
  updatedAt?: { seconds: number };
  userId?: string;
  }
  