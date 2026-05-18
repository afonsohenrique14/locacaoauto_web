import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { LocacaoPreset } from './core/theme/locacao-preset';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import {provideNgxMask} from 'ngx-mask'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
    provideNgxMask(),
    providePrimeNG({
      theme: {
        preset: LocacaoPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      }
    }),
  ],
};
