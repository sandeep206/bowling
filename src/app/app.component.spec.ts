import { DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('Bolwing games', () => {
  let fixture;
  let app: AppComponent;
  let appDebugElement: DebugElement;
  let appNativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    appDebugElement = fixture.debugElement;
    appNativeElement = appDebugElement.nativeElement;

    app.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should bowl 5 and 3 to score 8', () => {
    app.rollOneChange(5);
    fixture.detectChanges();
    app.rollTwoChange(3);
    fixture.detectChanges();
    const firstFrameScore = appNativeElement.querySelector('#total-0');

    expect(firstFrameScore.textContent).toBe('8');
    expect(app.frames[0].score).toBe(8);
  });

  it('should bowl a SPARE with 2 to score 12', () => {
    app.rollOneChange(3);
    fixture.detectChanges();
    app.rollTwoChange(7);
    fixture.detectChanges();
    app.rollOneChange(2);
    fixture.detectChanges();
    const firstFrameScore = appNativeElement.querySelector('#total-0');

    expect(firstFrameScore.textContent).toBe('12');
    expect(app.frames[0].score).toBe(12);
  });

  it('should bowl STRIKE with 2 and 5 to score 17', () => {
    app.rollOneChange(10);
    fixture.detectChanges();
    app.rollOneChange(2);
    fixture.detectChanges();
    app.rollTwoChange(5);
    fixture.detectChanges();
    const firstFrameScore = appNativeElement.querySelector('#total-0');

    expect(firstFrameScore.textContent).toBe('17');
    expect(app.frames[0].score).toBe(17);
  });

  it('should bowl all SPARE to score 150', () => {
    const pins = 5;
    throwBowl(10, pins);
    const totalScore = appNativeElement.querySelector('#total-9');

    expect(totalScore.textContent).toBe('150');
    expect(app.frames[9].score).toBe(150);
  });

  it('should bowl all STRIKE to score 300', () => {
    const pins = 10;
    throwBowl(10, pins);
    const totalScore = appNativeElement.querySelector('#total-9');

    expect(totalScore.textContent).toBe('300');
    expect(app.frames[9].score).toBe(300);
  });

  let throwBowl = (limit: number, pins: number) => {
    for (let i = 0; i < limit; i++) {
      app.rollOneChange(pins);
      fixture.detectChanges();

      app.rollTwoChange(pins);
      fixture.detectChanges();

      if (app.lastFrame === i) {
        app.rollThreeChange(pins);
        fixture.detectChanges();
      }
    }
  };
});
