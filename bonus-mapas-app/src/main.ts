import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Para utilizar mapbox:
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNzZiIsImEiOiJjbGdhbnV6cXgxMHplM2pvNmVwNnI0aG9oIn0.KzWt0F4fGzIoPKOhiopFng';


// Verificación para comprobar si la geolocalización está activada
if (!navigator.geolocation){
  // Si la geolocalización NO existe entonces se va a lanzar un error y se va a mostrar la alerta al usuario
  alert('Geolocalización no soportada por el navegador');
  throw new Error('Geolocalización no soportada por el navegador');
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
