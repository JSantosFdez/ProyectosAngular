import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;

  constructor( private placesService: PlacesService){}

  onQueryChanged(query: string = ''){

    // Para esperar x segundos antes de realizar la petición y no estar realizandolas cada vez que el usuario introduzca una letra
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
       // Aquí se indica lo que debe ocurrir una vez agotado el timeout establecido tras la coma
       this.placesService.getPlacesByQuery(query);
    }, 350);



  }
}
