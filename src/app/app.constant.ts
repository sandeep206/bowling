import { Frame, Roll } from './model/game';

export const SEQUENCE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const ATTEMPTS = [1, 2];

export const initFrames = (): Frame[] => {
  return Array.from(
    { length: SEQUENCE_NUMBERS.length },
    (x, i) =>
      ({
        frame: i,
        roll: getRoll(),
        score: 0,
        previousScore: 0,
        isSpare: false,
        isStrike: false,
        isGutter: false
      } as Frame)
  );
};

const getRoll = (): Roll[] => {
  const roll: Roll[] = Array.from({ length: ATTEMPTS.length }, (x, i) => ({
    roll: i + 1,
    hit: 0
  }));
  return roll;
};
