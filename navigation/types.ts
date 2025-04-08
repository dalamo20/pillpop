import type { Medication } from '../types';

export type PillStackParamList = {
  PillCabinetScreen: undefined;
  EditPillScreen: { pill: Medication };
};

export type RootStackParamList = {
  Home: undefined;
  PillCabinet: undefined;
  EditPillScreen: { pill: Medication };
};
