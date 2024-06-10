import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { iResponseApi } from '../Models/i-response-api';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private urlApi: string = environment.endpoint + "Alumno/";

  constructor(private http: HttpClient) { }


  listaAlumno(): Observable<iResponseApi> {
    return this.http.get<iResponseApi>(`${this.urlApi}Listar`);
  }

  guardarAlumno(pNombre: string, pAaPaterno: string, pAMaterno: string, pFecNaci: string): Observable<iResponseApi> {

    interface iAltaAlumno {
      nombre: string,
      aPaterno: string,
      aMaterno: string,
      fecNaci: string
    };

    const alumno: iAltaAlumno = {
      nombre: pNombre,
      aPaterno: pAaPaterno,
      aMaterno: pAMaterno,
      fecNaci: pFecNaci
    };

    return this.http.post<iResponseApi>(`${this.urlApi}Agregar`, alumno);
  }

  modificarAlumno(pMatricula: number, pNombre: string, pAaPaterno: string, pAMaterno: string, pFecNaci: string, pEstatus: boolean): Observable<iResponseApi> {
    interface iModificarAlumno {
      matricula: number,
      nombre: string,
      aPaterno: string,
      aMaterno: string,
      fecNaci: string,
      estatus: boolean
    }

    const alumno: iModificarAlumno = {
      matricula: pMatricula,
      nombre: pNombre,
      aPaterno: pAaPaterno,
      aMaterno: pAMaterno,
      fecNaci: pFecNaci,
      estatus: pEstatus
    };

    return this.http.put<iResponseApi>(`${this.urlApi}Modificar`, alumno);
  }


  borrarAlumno(matricula: number): Observable<iResponseApi> {
    return this.http.delete<iResponseApi>(`${this.urlApi}Borrar/${matricula}`);
  }

}
