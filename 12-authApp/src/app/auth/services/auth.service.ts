import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

import { AuthResponse, Usuario } from '../interfaces/interface';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Nos declaramos el url base de las peticiones que se van a realizar
  private baseUrl: string = environment.baseUrl;
  // Nos creamos un objeto de tipo usuario para almacenar los datos
  private _usuario!: Usuario;
  
  get usuario(){
    // Se devuelve el usuario desestructurado para romper la referencia y evitar que se edite así el elemento privado
    return {...this._usuario};
  }


  constructor( private http: HttpClient) { }

  registro(name: string, email: string, password:string){
    // url de la petición
    const url = `${this.baseUrl}/auth/new`;
    // declaramos el cuerpo de la petición
    const body = {name ,email, password};
    
    // El método devuelve el observable
    return this.http.post<AuthResponse>(url, body)
          .pipe(
            // Primero realizamos la gestión de la respuesta
            tap (resp => {
              if (resp.ok){

                // Si la respuesta es true entonces se guarda el token
                localStorage.setItem('token', resp.token!);
              }
            }
              ),
            // Vamos a definir qué informa se va a devolver cuando se realice esta petición
            map( resp => resp.ok),
            catchError( 
              // Si hay error se devuelve el mensaje de error
              err => of(err.error.msg))
          )
  }

  login( email: string, password: string){

    // url de la petición
    const url = `${this.baseUrl}/auth`;
    // declaramos el cuerpo de la petición
    const body = {email, password}
    
    // El método devuelve el observable
    return this.http.post<AuthResponse>(url, body)
          .pipe(
            // Primero realizamos la gestión de la respuesta
            tap (resp => {
              if (resp.ok){

                // Si la respuesta es true entonces se guarda el token
                localStorage.setItem('token', resp.token!);

              }
            }
              ),
            // Vamos a definir qué informa se va a devolver cuando se realice esta petición
            map( resp => resp.ok),
            catchError( 
              // Si hay error se devuelve el mensaje de error
              err => of(err.error.msg))
          )
  }


  // Método que va a permitir comprobar si un token es válido
  validarToken(): Observable<boolean>{
    const url = `${this.baseUrl}/auth/renew`;
    // Declarción de los headers
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

    // En este caso, esta petición necesita que se le manden los headers
    return this.http.get<AuthResponse>(url, {headers})
    .pipe( // hay que convertir esta respuesta en un Observable de tipo boolean
      map( resp =>{
          
        // Si la respuesta es true entonces se guarda el token
          localStorage.setItem('token', resp.token!);

          //Y además se crea el usuario 
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }

        return resp.ok;
      }),
      catchError(err => of(false))
    );
  }

  logout(){
    localStorage.removeItem('token');
  }

}
