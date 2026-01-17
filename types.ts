
export interface TimerState {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
}

export enum PresetTimes {
  THIRTY_SECONDS = 30,
  FORTY_SECONDS = 40,
  TWO_MINUTES = 120,
}
