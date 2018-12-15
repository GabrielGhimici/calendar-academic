import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { AppRootComponent } from './app-root/app-root.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MonthViewComponent } from './app-root/event-views/month-view/month-view.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full' },
  {
    path: 'events',
    component: AppRootComponent,
    children: [
      {
        path: '',
        redirectTo: 'month',
        pathMatch: 'full'
      },
      {
        path: 'month',
        component: MonthViewComponent
      }
    ]
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
