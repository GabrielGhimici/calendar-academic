import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { AppRootComponent } from './app-root/app-root.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MonthViewComponent } from './app-root/event-views/month-view/month-view.component';
import { EventViewsComponent } from './app-root/event-views/event-views.component';
import { LoginComponent } from './login/web-component/login.component';
import { LoginGuard } from './login/login.guard';
import { WeekViewComponent } from './app-root/event-views/week-view/week-view.component';
import { DayViewComponent } from './app-root/event-views/day-view/day-view.component';
import { ManageEventComponent } from './app-root/manage-event/manage-event.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'event',
    pathMatch: 'full'
  },
  {
    path: 'event',
    component: AppRootComponent,
    children: [
      {
        path: '',
        redirectTo: 'views',
        pathMatch: 'full'
      },
      {
        path: 'views',
        component: EventViewsComponent,
        data: {isPrivate: false},
        children: [
          {
            path: '',
            redirectTo: 'month',
            pathMatch: 'full'
          },
          {
            path: 'month',
            component: MonthViewComponent,
            data: {isPrivate: false}
          },
          {
            path: 'week',
            component: WeekViewComponent,
            data: {isPrivate: false}
          },
          {
            path: 'day',
            component: DayViewComponent,
            data: {isPrivate: false}
          }
        ]
      },
      {
        path: 'new',
        component: ManageEventComponent
      },
      {
        path: 'edit/:id',
        component: ManageEventComponent
      },
    ],
    canActivate: [LoginGuard]
  },{
    path: 'my-event',
    component: AppRootComponent,
    children: [
      {
        path: '',
        redirectTo: 'views',
        pathMatch: 'full'
      },
      {
        path: 'views',
        component: EventViewsComponent,
        data: {isPrivate: true},
        children: [
          {
            path: '',
            redirectTo: 'month',
            pathMatch: 'full'
          },
          {
            path: 'month',
            component: MonthViewComponent,
            data: {isPrivate: true}
          },
          {
            path: 'week',
            component: WeekViewComponent,
            data: {isPrivate: true}
          },
          {
            path: 'day',
            component: DayViewComponent,
            data: {isPrivate: true}
          }
        ]
      },
    ],
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: !environment.production})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
