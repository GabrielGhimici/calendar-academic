import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { AppRootComponent } from './app-root/app-root.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  { path: 'app', component: AppRootComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: !environment.production})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
