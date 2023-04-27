import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[]=[];

  constructor(private directionsApi: DirectionsApiClient){}

  get isMapReady(){
    return !!this.map;
  }


  setMap( map: Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike ){
    // Antes de desplazarnos a ningún sitio se debe comprobar si el mapa está listo
    if (!this.isMapReady) throw Error ('El mapa no está disponible para realizar esta acción');

    this.map?.flyTo({
      zoom:14, // Se establece un nuevo zoom
      center: coords
    })
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]){


    if (!this.map) throw Error('Mapa no inicializado');
    
    //Para eliminar los marcadores ya existentes en el mapa
    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];


    // Para crear y añadir los nuevos marcadores
    for (const place of places){
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
        <h6>${place.text}</h6>
        <span>${place.place_name}</span>`)

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup (popup)
        .addTo(this.map);

        // Añadimos los marcadores al array de nuevos marcadores
        newMarkers.push(newMarker);
    }

    // Actualizamos el array de marcadores
    this.markers = newMarkers;

    if (places.length === 0) return; // Si no existen paises entonces que no retorne nada

    // ------------------------------------------------------------------------------
    // Para adaptar el zoom del mapa y que se puedan visualizar todos los marcadores :
    const bounds = new LngLatBounds(); // Se declara la variable para los límites del mapa

    newMarkers.forEach(marker => bounds.extend(marker.getLngLat())); // Se introduce en los límites las coordenadas de cada uno de los marcadores

    // Se introduce además la posición del usuario
    bounds.extend(userLocation);
    this.map.fitBounds(bounds, {padding: 100});
  }


  // -----------------------------
  // Cálculo de rutas
  getRouteBetweenPoitns(start: [number,number], end: [number,number]){

    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp=>this.drawPolyline(resp.routes[0]));

  }

  private drawPolyline(route: Route){

    console.log({kms: route.distance/1000, duration: route.duration / 60});

    if (!this.map) throw Error('Mapa no inicializaod');

    //Para alejar el zoom y que reconozca todos los puntos:
    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
      // Hay que incluir ahora cada uno de los puntos de la ruta
      coords.forEach(([lng,lat]) => {
        // Una vez desestructurada la coordenada en longitud y latitud, se inserta en bounds
        bounds.extend([lng,lat]);
      });


    this.map?.fitBounds(bounds, {
      padding: 200
    });
    
    
    // ----------------------------------------------------
    //Polyline aka la línea que se dibuja
    const sourceData: AnySourceData = {
      type: 'geojson',
      data:{
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties:{},
          geometry:{
            type: 'LineString',
            coordinates: coords
          }
        }]
      }
    }


    if (this.map.getLayer('RouteString')) {
          this.map.removeLayer('RouteString');
          this.map.removeSource('RouteString');
        }

    this.map.addSource('RouteString',sourceData);

    this.map.addLayer({
      id:'RouteString',
      type:'line',
      source: 'RouteString',
      layout:{
        'line-cap':'round',
        "line-join":'round'
      },
      paint:{
        "line-color":'pink',
        "line-width":8
      }
    })
  }


}
