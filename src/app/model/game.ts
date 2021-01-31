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

// For later:
// export interface Game {
//   user: User[]
// }

// export interface User {
//   frame: Frame[];
//   player: string;
//   total: number;
// }
