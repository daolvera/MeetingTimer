import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EventDto } from '../_models/event.dto';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private currentEvents: EventDto[] = [];

  public get(eventId: number): Observable<EventDto> {
    const currentEvent = this.currentEvents.find(
      (event) => event.id === eventId
    );
    if (currentEvent) {
      return of(currentEvent);
    }
    throw new Error('Event not found');
  }

  public getAll(searchTerm: string | null): Observable<EventDto[]> {
    if (searchTerm) {
      return of(
        this.currentEvents.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return of(this.currentEvents);
  }

  public delete(eventId: number): Observable<boolean> {
    this.currentEvents = this.currentEvents.filter(
      (event) => event.id !== eventId
    );
    return of(true);
  }

  public create(event: EventDto): Observable<number> {
    event.id = this.currentEvents.length + 1;
    event.firstTalkTitle =
      event.talks.length > 0 ? event.talks[0].name : undefined;
    this.currentEvents.push(event);
    return of(event.id);
  }

  public update(event: EventDto): Observable<boolean> {
    this.currentEvents = this.currentEvents.map((e) =>
      e.id === event.id ? event : e
    );
    event.firstTalkTitle =
      event.talks.length > 0 ? event.talks[0].name : undefined;
    return of(true);
  }
}
