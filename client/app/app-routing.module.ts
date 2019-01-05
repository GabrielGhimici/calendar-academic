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
        children: [
          {
            path: '',
            redirectTo: 'month',
            pathMatch: 'full'
          },
          {
            path: 'month',
            component: MonthViewComponent
          },
          {
            path: 'week',
            component: WeekViewComponent
          },
          {
            path: 'day',
            component: DayViewComponent
          }
        ]
      }
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
