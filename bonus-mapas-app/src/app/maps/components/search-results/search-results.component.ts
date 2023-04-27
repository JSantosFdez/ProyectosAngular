import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Feature } from '../../interfaces/places';
import { MapService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public selectedId: string = '';

  constructor (private placesService: PlacesService,
              private mapService: MapService){}

  get isLoadingPlaces(): boolean{
    return this.placesService.isLoadinPlaces;
  }

  get places(): Feature[]{
    return this.placesService.places;
  }

  flyTo(place:Feature){
    // Se marca el elemento seleccionado:
    this.selectedId = place.id;

    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }


  // Para obtener las direcciones

  getDirections(place: Feature){
    if (!this.placesService.useLocation) throw Error('No se cuenta con la ubicación del usuario ');

    // Una vez se ha seleccionado una dirección se quiere ocultar la lista con los paises
    this.placesService.deletePlaces();

    const start = this.placesService.useLocation;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoitns(start, end);
  }
}
