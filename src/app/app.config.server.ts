import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

// ✅ SSR completely disabled — admin dashboard aur baaki pages sahi kaam karenge
const serverConfig: ApplicationConfig = {
  providers: []
};

export const config = mergeApplicationConfig(appConfig, serverConfig);