import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor( private mapService: MapService,
                private placeService: PlacesService){}

  goToMyLocation(){

    // Comprobamos primero si la ubicación del usuario no existe
    if (!this.placeService.useLocation) throw Error(' No se tiene coordenadas a las que dirigirse');
    if (!this.mapService.isMapReady) throw Error(' No existe mapa sobre el que trabajar');

    // Si ha pasado los dos filtros se supone que se tiene el mapa y una ubicación a la que pasar
    this.mapService.flyTo(this.placeService.useLocation!);
  }

}
