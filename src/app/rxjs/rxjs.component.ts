import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  concat,
  concatAll,
  concatMap,
  exhaustMap,
  forkJoin,
  interval,
  map,
  merge,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
  zip,
} from 'rxjs';
import { allData } from './rxjs.const';

interface DataShow {
  time?: string;
  firstData?: string;
  secondData?: string;
  finalData?: any;
}

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.scss'],
})
export class RxjsComponent implements OnInit {
  intervalForFirst: number = 2;
  intervalForSecond: number = 2;
  firstObs$!: Observable<string>;
  secondObs$!: Observable<string>;
  firstObsNumber: number = 2;
  secondObsNumber: number = 4;

  firstObsDataList: string[] = [];
  secondObsDataList: string[] = [];

  consolidatedData: DataShow[] = [];

  timer$ = interval(1000);
  currentSeconds: string = '';
  clearSubscription: Subject<boolean> = new Subject();
  selectedDataObj: any;

  constructor() {}

  ngOnInit(): void {
    this.createObs();
  }

  createObs() {
    this.firstObs$ = interval(this.intervalForFirst * 1000).pipe(
      take(this.firstObsNumber),
      map((n) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.firstData = obj.firstData
            ? `${obj.firstData}, a${n + 1}`
            : `a${n + 1}`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            firstData: `a${n + 1}`,
          });
        }
        return `a${n + 1}`;
      }),
    );
    this.secondObs$ = interval(this.intervalForSecond * 1000).pipe(
      take(this.secondObsNumber),
      map((n) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.secondData = obj.secondData
            ? `${obj.secondData}, b${n + 1}`
            : `b${n + 1}`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            secondData: `b${n + 1}`,
          });
        }
        return `b${n + 1}`;
      }),
    );
  }

  changeTimer(objectNumber: number, incDecFlag: number) {
    this.resetAll();
    switch (objectNumber) {
      case 1: {
        incDecFlag === 1 ? this.intervalForFirst++ : this.intervalForFirst--;
        this.intervalForFirst =
          this.intervalForFirst < 0 ? 0 : this.intervalForFirst;
        this.intervalForFirst =
          this.intervalForFirst > 5 ? 5 : this.intervalForFirst;
        break;
      }
      case 2: {
        incDecFlag === 1 ? this.intervalForSecond++ : this.intervalForSecond--;
        this.intervalForSecond =
          this.intervalForSecond < 0 ? 0 : this.intervalForSecond;
        this.intervalForSecond =
          this.intervalForSecond > 5 ? 5 : this.intervalForSecond;
        break;
      }
    }

    this.createObs();
  }

  changeObjects(objectNumber: number, incDecFlag: number) {
    this.resetAll();
    switch (objectNumber) {
      case 1: {
        incDecFlag === 1 ? this.firstObsNumber++ : this.firstObsNumber--;
        this.firstObsNumber = this.firstObsNumber < 0 ? 0 : this.firstObsNumber;
        this.firstObsNumber = this.firstObsNumber > 5 ? 5 : this.firstObsNumber;
        break;
      }
      case 2: {
        incDecFlag === 1 ? this.secondObsNumber++ : this.secondObsNumber--;
        this.secondObsNumber =
          this.secondObsNumber < 0 ? 0 : this.secondObsNumber;
        this.secondObsNumber =
          this.secondObsNumber > 5 ? 5 : this.secondObsNumber;
        break;
      }
    }

    this.createObs();
  }

  switchMapCall() {
    this.resetAll();
    this.selectedDataObj = allData['switchMap'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));

    this.firstObs$
      .pipe(
        takeUntil(this.clearSubscription),
        switchMap((a) => {
          return this.secondObs$.pipe(
            takeUntil(this.clearSubscription),
            map((b) => {
              return [a, b];
            }),
          );
        }),
      )
      .subscribe((data) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.finalData = obj.finalData
            ? `${obj.finalData}, [${data}]`
            : `[${data}]`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            finalData: `[${data}]`,
          });
        }
      });
  }

  mergeMapCall() {
    this.resetAll();
    this.selectedDataObj = allData['mergeMap'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    this.firstObs$
      .pipe(
        takeUntil(this.clearSubscription),
        mergeMap((a) => {
          return this.secondObs$.pipe(
            takeUntil(this.clearSubscription),
            map((b) => {
              return [a, b];
            }),
          );
        }),
      )
      .subscribe((data) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.finalData = obj.finalData
            ? `${obj.finalData}, [${data}]`
            : `[${data}]`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            finalData: `[${data}]`,
          });
        }
      });
  }

  concatMapCall() {
    this.resetAll();
    this.selectedDataObj = allData['concatMap'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    this.firstObs$
      .pipe(
        takeUntil(this.clearSubscription),
        concatMap((a) => {
          return this.secondObs$.pipe(
            takeUntil(this.clearSubscription),
            map((b) => {
              return [a, b];
            }),
          );
        }),
      )
      .subscribe((data) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.finalData = obj.finalData
            ? `${obj.finalData}, [${data}]`
            : `[${data}]`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            finalData: `[${data}]`,
          });
        }
      });
  }

  exhaustMapCall() {
    this.resetAll();
    this.selectedDataObj = allData['exhaustMap'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    this.firstObs$
      .pipe(
        takeUntil(this.clearSubscription),
        exhaustMap((a) => {
          return this.secondObs$.pipe(
            takeUntil(this.clearSubscription),
            map((b) => {
              return [a, b];
            }),
          );
        }),
      )
      .subscribe((data) => {
        const obj = this.consolidatedData.find(
          (data) => data.time === this.currentSeconds,
        );
        if (obj) {
          obj.finalData = obj.finalData
            ? `${obj.finalData}, [${data}]`
            : `[${data}]`;
        } else {
          this.consolidatedData.push({
            time: this.currentSeconds,
            finalData: `[${data}]`,
          });
        }
      });
  }

  combineLatestCall() {
    this.resetAll();
    this.selectedDataObj = allData['combineLatest'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    combineLatest([this.firstObs$, this.secondObs$]).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }

  mergeCall() {
    this.resetAll();
    this.selectedDataObj = allData['merge'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    merge(this.firstObs$, this.secondObs$).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }

  concatCall() {
    this.resetAll();
    this.selectedDataObj = allData['concat'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    concat(this.firstObs$, this.secondObs$).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }

  zipCall() {
    this.resetAll();
    this.selectedDataObj = allData['zip'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    zip(this.firstObs$, this.secondObs$).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }

  forkJoinCall() {
    this.resetAll();
    this.selectedDataObj = allData['forkJoin'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    forkJoin([this.firstObs$, this.secondObs$]).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }

  withLatestFromCall() {
    this.resetAll();
    this.selectedDataObj = allData['withLatestFrom'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    this.firstObs$.pipe(withLatestFrom(this.secondObs$)).subscribe((data) => {
      const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      }
    });
  }
  concatAllCall() {
    this.resetAll();
    this.selectedDataObj = allData['concatAll'];
    this.timer$
      .pipe(takeUntil(this.clearSubscription))
      .subscribe((data) => (this.currentSeconds = `${data + 1} S`));
    this.firstObs$.pipe(/* concatAll() */).subscribe((data) => {
      console.log(data);
      /*  const obj = this.consolidatedData.find(
        (data) => data.time === this.currentSeconds,
      );
      if (obj) {
        obj.finalData = obj.finalData
          ? `${obj.finalData}, [${data}]`
          : `[${data}]`;
      } else {
        this.consolidatedData.push({
          time: this.currentSeconds,
          finalData: `[${data}]`,
        });
      } */
    });
  }

  resetAll() {
    this.consolidatedData = [];
    this.selectedDataObj = undefined;
    this.clearSubscription.next(true);
  }
}
