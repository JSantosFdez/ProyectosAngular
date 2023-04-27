import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient extends HttpClient{
    public baseUrl : string = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

    constructor ( handler: HttpHandler){
        super(handler);
    }

    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
        };
    }){

        url = this.baseUrl + url;

        // Aquí se llama a la petición http del httpClient en el servicio
        return super.get<T>(url, {
            // Definimos los parámetros:
            params: {
                language:'es',
                access_token: environment.apikey,
                limit: '5',
                ...options.params // Desestructuramos el array con el resto de parámetros

            }
        });
    }
}