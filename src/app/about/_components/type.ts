export type Career = {
  logo: string;
  company: string;
  team: string;
  role: string;
  period: string;
  stacks: string[];
  info?: string[];
};

export type Project = {
  title: string;
  description: string;
  role: string;
  period: string;
  stacks: string[];
  info?: string[];
};

export type TechStack = {
  title: string;
  elements: string[];
};

export type Activity = {
  title: string;
  contents?: string[];
  period: string;
};
