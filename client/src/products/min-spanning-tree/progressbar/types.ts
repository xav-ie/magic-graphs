type PartialProgressThemeOptions = Partial<{
  backgroundColor: string;
  progressColor: string;
  easeTime: number;
  borderRadius: number;
  progressEasing: "linear" | "ease-in-out";
}>;

export type ProgressOptions = {
  theme?: PartialProgressThemeOptions;
  startProgress: number;
  currentProgress: number;
  endProgress: number;
};

export const PROGRESS_DEFAULTS = {
  backgroundColor: "white",
  progressColor: "green",
  easeTime: 250,
  progressEasing: "ease-in-out",
  borderRadius: 0,
};
