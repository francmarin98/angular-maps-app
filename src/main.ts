import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (!navigator.geolocation) {
  alert('Geolocation is not available');
  throw new Error('Geolocation is not available');
}


import Mapboxgl from 'mapbox-gl'; // or "const Mapboxgl = require('mapbox-gl');"
Mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2Nva2x6IiwiYSI6ImNreG5xOWMzbzR0amkydHFoZDFqNWdycjIifQ.o6F3ce_D9o4psnShniVMyw';



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
