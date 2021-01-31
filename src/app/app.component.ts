import { Component, OnInit } from '@angular/core';
import { Frame, Roll, Attempt } from './model/game';
import { initFrames, SEQUENCE_NUMBERS } from './app.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  frames = [];
  rollOne = [];
  rollTwo = [];
  index: number;

  ngOnInit() {
    this.frames = initFrames();
    this.rollOne = [0, ...SEQUENCE_NUMBERS];
  }

  startPlaying() {
    this.index = this.index || 0;
  }
  continuePlaying() {
    this.index =
      this.index < SEQUENCE_NUMBERS.length ? ++this.index : this.index;
  }

  rollOneChange(value: number, attempt: Attempt = 1) {
    // set the frame number
    this.index || this.index === 0
      ? this.continuePlaying()
      : this.startPlaying();

    //get the possible values for roll two
    this.updateRollTwo(+value);

    const currentFrame: Frame = this.frames[this.index];
    // update the frame and score board
    this.frames[this.index] = this.updateCurrentFrame(
      attempt,
      +value,
      currentFrame
    );

    // update score for previous frame
    this.updateScore(attempt);
  }

  getRollsFrom(start: number, current: number): Roll[] {
    const rolls: Roll[] = this.frames
      .slice(start, current)
      .map((frame: Frame) => frame.roll)
      .reduce((acc, roll) => {
        return [...acc, ...roll];
      }, []);
    return rolls;
  }

  updateScore(currentAttempt: Attempt) {
    // loop through the frames
    const i = this.index;
    const previousFrame: Frame = i - 1 >= 0 ? this.frames[i - 1] : undefined;
    const currentFrame: Frame = this.frames[i];

    currentFrame.previousScore = previousFrame
      ? previousFrame.score
      : currentFrame.score;

    if (!currentFrame.isStrike && !currentFrame.isSpare && currentAttempt > 1) {
      const start = i;
      const current = i + 1;

      const rolls = this.getRollsFrom(start, current);

      // update score board
      currentFrame.score =
        this.getTotalPins(rolls) + currentFrame.previousScore;
    }

    if (previousFrame && previousFrame.isSpare && currentAttempt === 1) {
      const start = i - 1;
      const current = i + 1;

      const rolls: Roll[] = this.getRollsFrom(start, current);

      // update score board
      previousFrame.score =
        this.getTotalPins(rolls) + previousFrame.previousScore;
      currentFrame.previousScore = previousFrame.score; // to handle 1st spare and 2nd strike
    }

    if (previousFrame && previousFrame.isStrike && currentAttempt === 2) {
      const start = i - 1;
      const current = i + 1;

      const rolls: Roll[] = this.getRollsFrom(start, current);

      // update score board
      previousFrame.score =
        this.getTotalPins(rolls) + previousFrame.previousScore;
      if (!currentFrame.isSpare) {
        currentFrame.score += previousFrame.score;
      }
      currentFrame.previousScore = previousFrame.score; // to handle 1st spare and 2nd strike
    }
  }

  rollTwoChange(value: number, attempt: Attempt = 2) {
    this.frames[this.index] = this.updateCurrentFrame(
      attempt,
      +value,
      this.frames[this.index]
    );
    this.updateScore(attempt);
  }

  updateCurrentFrame(attempt: Attempt, value: number, frame: Frame): Frame {
    const newFrame = {
      ...frame,
      roll: this.updateHit(attempt, value, frame.roll),
      isGutter: this.isGutter(value),
      isStrike: this.isStrike(value, attempt),
      isSpare: this.isSpare(frame.roll, attempt)
    };

    return newFrame;
  }

  updateHit(rollNumber: number, pins: number, rolls: Roll[]): Roll[] {
    return rolls.map((roll) => {
      if (roll.roll === rollNumber) {
        roll.hit = +pins;
      }
      return roll;
    });
  }

  getTotalPins(rolls: Roll[]): number {
    return rolls.reduce((score, roll) => (score += roll.hit), 0);
  }

  updateRollTwo(selectedValue): void {
    if (selectedValue !== 10) {
      const length = SEQUENCE_NUMBERS.length - selectedValue + 1;
      this.rollTwo = Array.from({ length }, (x, i) => i);
    } else {
      this.rollTwo = [];
    }
  }

  isStrike(value: number, attempt: Attempt): boolean {
    return (
      attempt === 1 && value === SEQUENCE_NUMBERS[SEQUENCE_NUMBERS.length - 1]
    );
  }
  isSpare(rolls: Roll[], attempt: Attempt): boolean {
    return (
      attempt === 2 &&
      this.getTotalPins(rolls) === SEQUENCE_NUMBERS[SEQUENCE_NUMBERS.length - 1]
    );
  }
  isGutter(value: number): boolean {
    return !!value;
  }
}
