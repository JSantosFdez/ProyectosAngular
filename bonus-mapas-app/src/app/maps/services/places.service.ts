import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesResponse } from '../interfaces/places';
import { Feature } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation?: [number, number];

  public isLoadinPlaces:boolean = false;
  public places: Feature[] = [];


  get isUserLocationReady(): boolean {
    return !!this.useLocation; // Queremos que sea true cuando SÍ haya un valor
  }




  constructor(private mapService: MapService,
    private placesApi: PlacesApiClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise ((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.useLocation = [coords.longitude, coords.latitude];
          resolve(this.useLocation)
        },
        (err) =>{
          alert('No se pudo obtener la geolocalización');
          console.log(err);
          reject();
        }
      );

    });
  }


  getPlacesByQuery ( query: string = ''){
    // todo: evaluar cuando el query es nulo
    if (query.length===0){
      this.places=[]; // Se vacía el contenedor de lugares
      this.isLoadinPlaces=false; // No se está realizando ninguna búsqueda
      return; // No se debería ejecutar nada más
    }

    if (!this.useLocation) throw Error ('No hay userLocation');
    // Cuando comenzamos a buscar se están cargando los lugares
    this.isLoadinPlaces = true;

    this.placesApi.get<PlacesResponse>(`${query}.json`, {
      params:{
        proximity: this.useLocation.join(',')
      }
    })
      .subscribe(resp =>{
          // Una vez se tienen los lugares ya no se están buscando
          this.isLoadinPlaces = false;
          this.places = resp.features;

          //Teniendo los lugares se pueden incluir los marcadores en el mapa
          if (!this.useLocation) throw Error('No se tiene posición del usuario');
          this.mapService.createMarkersFromPlaces(this.places, this.useLocation);
      });
  }

  // Método utilizado para ocultar los paises
  deletePlaces(){
    this.places = [];
  }

}
