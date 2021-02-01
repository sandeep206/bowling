export interface Roll {
  hit: number;
  roll: number;
}
export interface Frame {
  frame: number;
  roll: Roll[];
  score: number;
  isSpare: boolean;
  isStrike: boolean;
  isGutter: boolean;
  previousScore: number;
}

export type Attempt = 1 | 2 | 3;

export interface Game {
  frame: Frame[];
  player: string;
  total: number;
}
