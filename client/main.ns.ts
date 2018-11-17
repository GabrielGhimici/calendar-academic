import { platformNativeScriptDynamic } from 'nativescript-angular/platform';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

platformNativeScriptDynamic().bootstrapModule(AppModule);
