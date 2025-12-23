export type BarPair = {
  explicit: number;
  implicit: number;
  label: string;
  discrepancyLabel: string;
};

export type ChartData = {
  groups: BarPair[];
};
