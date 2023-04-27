import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import {Map, Popup, Marker} from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{

  // Para mostrar el mapa:
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef

  constructor(private placesService: PlacesService,
              private mapService: MapService){

  }

  ngAfterViewInit(): void {

    // Por si acaso no existe el userLocation por el motivo que fuese lanzamos un error
    if (!this.placesService.useLocation) throw Error ('No hay una localización de usuario para mostrar el mapa')
    
    // Una vez se ha inicializado ya se tienen todos los elementos de la página html creado y se debería contar ya con la localización del usuario
    const map = new Map({
      container: this.mapDivElement.nativeElement, // Elemento HTML donde queremos incluir el mapa . Es el definido en el viewChidl
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.useLocation, // starting position [lng, lat] Corresponde con el user location del servicio
      zoom: 14, // starting zoom
      });

      // Para crear popups y marcadores
      const popup = new Popup()
        .setHTML(`
        <h6>Usted está aquí</h6>
        <span> En este lugar del mundo</span>
        `);

      new Marker({color: 'red'})
        .setLngLat(this.placesService.useLocation) // se establece la ubicación
        .setPopup(popup)  // Se establece la etiqueta
        .addTo(map);      // Se inserta en el mapa
      

      // Una vez tenemos el mapa creado por primera vez, establecemos el mapa
      this.mapService.setMap(map);
  }
}
