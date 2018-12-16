import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootEpics } from './store/root.epics';
import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import { AppState } from './store/app-state';
import { createEpicMiddleware } from 'redux-observable';
import { rootReducer } from './store/root.reducer';
import { environment } from '../environments/environment';
import { provideReduxForms } from '@angular-redux/form';
import { createLogger } from 'redux-logger';
import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './app-root/app-root.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { LoginActions } from 'client/app/store/login/login.actions';
import { LoginGuard } from 'client/app/login/login.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import {
  MatButtonModule, MatToolbarModule, MatIconModule,
  MatCardModule, MatFormFieldModule,
  MatSnackBarModule, MatProgressSpinnerModule, MatInputModule
} from '@angular/material';
import { MonthViewComponent } from './app-root/event-views/month-view/month-view.component';
import { EventViewsComponent } from './app-root/event-views/event-views.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppRootComponent,
    PageNotFoundComponent,
    MonthViewComponent,
    EventViewsComponent
  ],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatButtonToggleModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgReduxModule,
    NgReduxRouterModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'CAToken',
      headerName: 'Authorization',
    }),
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    AppRoutingModule
  ],
  providers: [
    RootEpics,
    NgReduxRouter,
    LoginActions,
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    public store: NgRedux<AppState>,
    devTools: DevToolsExtension,
    ngReduxRouter: NgReduxRouter,
    rootEpics: RootEpics
  ) {
    const middleware = createEpicMiddleware();
    store.configureStore(
      rootReducer,
      {},
      environment.production ? [middleware] : [createLogger(), middleware],
      devTools.isEnabled() ? [devTools.enhancer()] : []
    );
    for (const epic of rootEpics.createEpics()) {
      middleware.run(epic);
    }
    if (ngReduxRouter) {
      ngReduxRouter.initialize();
    }
    provideReduxForms(store);
  }
}
