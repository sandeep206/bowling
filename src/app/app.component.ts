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
  rollThree = [];
  index: number;
  lastFrame = 9;

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
    const prePreviousFrame: Frame = i - 2 >= 0 ? this.frames[i - 2] : undefined;
    const previousFrame: Frame = i - 1 >= 0 ? this.frames[i - 1] : undefined;
    const currentFrame: Frame = this.frames[i];

    currentFrame.previousScore = previousFrame
      ? previousFrame.score
      : currentFrame.score;

    if (currentAttempt === 3) {
      const start = i;
      const current = i + 1;

      const rolls = this.getRollsFrom(start, current);

      // update score board
      currentFrame.score =
        this.getTotalPins(rolls) + currentFrame.previousScore;
    }

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

    if (
      prePreviousFrame &&
      prePreviousFrame.isStrike &&
      previousFrame.isStrike
    ) {
      // for all contineous strikes
      const start = i - 2;
      const previous = i === this.lastFrame ? i : i + 1;

      let rolls: Roll[] = this.getRollsFrom(start, previous);

      if (i === this.lastFrame) {
        const lastFrameRolls = this.frames[i].roll.slice(0, currentAttempt);
        rolls = [...rolls, ...lastFrameRolls];
      }

      if (currentAttempt !== 2) {
        prePreviousFrame.score =
          this.getTotalPins(rolls) + prePreviousFrame.previousScore;
        previousFrame.previousScore = prePreviousFrame.score;
      }
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

  rollThreeChange(value: number, attempt: Attempt = 3) {
    this.frames[this.index] = this.updateCurrentFrame(
      attempt,
      +value,
      this.frames[this.index]
    );
    // update the score
    this.updateScore(attempt);
    // show final result
  }

  updateCurrentFrame(attempt: Attempt, value: number, frame: Frame): Frame {
    let newFrame = {
      ...frame,
      roll: this.updateHit(attempt, value, frame.roll),
      isGutter: this.isGutter(value),
      isStrike: this.isStrike(value, attempt),
      isSpare: this.isSpare(frame.roll, attempt)
    };

    // check if last frame, then add extra roll for spare and strike
    if (this.isLastFrameSpecial(newFrame, attempt)) {
      this.rollThree = [0, ...SEQUENCE_NUMBERS];
      const newRoll: Roll = {
        roll: 3,
        hit: 0
      };
      newFrame = {
        ...newFrame,
        roll: [...newFrame.roll, newRoll]
      };
    }

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
    if (this.index === this.lastFrame) {
      this.rollTwo = [0, ...SEQUENCE_NUMBERS];
    } else if (selectedValue !== 10) {
      const length = SEQUENCE_NUMBERS.length - selectedValue + 1;
      this.rollTwo = Array.from({ length }, (x, i) => i);
    } else {
      this.rollTwo = [];
    }
  }

  isLastFrameSpecial(frame: Frame, attempt: Attempt): boolean {
    return (
      this.index === this.lastFrame &&
      ((frame.isStrike && attempt === 1) || (frame.isSpare && attempt === 2))
    );
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
    return !value;
  }
}
