import { Routes } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { EventsSearchComponent } from './events-search/events-search.component';

export const routes: Routes = [
  {
    path: '',
    component: EventsSearchComponent,
    title: 'Meeting Timer',
  },
  {
    path: 'create',
    component: CreateEventComponent,
    title: 'Create Event | Meeting Timer',
  },
  {
    path: 'edit/:id',
    component: CreateEventComponent,
    title: 'Edit Event | Meeting Timer',
  },
  {
    path: 'view/:id',
    component: ViewEventComponent,
    title: 'View Event | Meeting Timer',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
