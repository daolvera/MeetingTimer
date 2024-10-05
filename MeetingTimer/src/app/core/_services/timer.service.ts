import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Timer } from '../_models/timer.model';

const TEN_MINUTES = 600000;
const ONE_MINUTE = 60000;
const THIRTY_SECONDS = 30000;

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timersSignal: WritableSignal<Timer[]> = signal([]);

  public get timers(): Signal<Timer[]> {
    return this.timersSignal.asReadonly();
  }

  public addTimer() {
    this.timersSignal.update((o) => {
      let id = (o[o.length - 1]?.id ?? 0) + 1
      o.push(this.getDefaultTimer(id));
      return o;
    });
  }

  private getDefaultTimer(id: number): Timer {
    return {
      id: id,
      name: '',
      overallTime: TEN_MINUTES,
      warningTime: ONE_MINUTE,
      dangerTime: THIRTY_SECONDS,
    };
  }
}
