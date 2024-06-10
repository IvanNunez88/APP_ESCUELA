import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; //MODALES
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
// 
import moment from 'moment'; //TRABAJAR CON FECHAS
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core'; //TRABAJAR CON FORMATO DE FECHAS
import { iAlumno } from '../../../../Models/i-alumno';
import { DateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';
import { AlumnoService } from '../../../../Services/alumno.service';


//CONFIGURACIÓN DE FECHAS PARA EL CALENDARIO
export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}
// 
@Component({
  selector: 'app-modal-alumno',
  standalone: true,
  imports: [MatDialogModule, MatGridListModule, FormsModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule, MatLabel, CommonModule, MatSlideToggleModule],
  templateUrl: './modal-alumno.component.html',
  styleUrl: './modal-alumno.component.css',
  providers: [provideNativeDateAdapter(),
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }]
})
export class ModalAlumnoComponent implements OnInit {

  tituloAccion: string = "Agregar";
  formularioAlumno: FormGroup;
  mostrarToggle: boolean = false;
  currenDate: any = new Date();
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalAlumnoComponent>,
    private fb: FormBuilder,
    private _alumnoServicio: AlumnoService,
    @Inject(MAT_DIALOG_DATA) public datosAlumno: iAlumno,

  ) {
    this.formularioAlumno = this.fb.group({
      nombre: ['', Validators.required],
      aPaterno: ['', Validators.required],
      aMaterno: ['', Validators.required],
      fecNaci: ['', Validators.required],
      idEstatus: ['']
    })

    if (this.datosAlumno != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
      this.mostrarToggle = true;

      this.formularioAlumno.patchValue({
        nombre: this.datosAlumno.nombre,
        aPaterno: this.datosAlumno.aPaterno,
        aMaterno: this.datosAlumno.aMaterno,
        fecNaci: this.datosAlumno.fecNaciF,
        idEstatus: this.datosAlumno.idEstatus
      })

    }

  }

  ngOnInit(): void { }

  guardarEditar() {

    const nombre: string = this.formularioAlumno.value.nombre;
    const aPaterno: string = this.formularioAlumno.value.aPaterno;
    const aMaterno: string = this.formularioAlumno.value.aMaterno;
    const fecNaci: string = moment(this.formularioAlumno.value.fecNaci).format('DDMMYYYY').toString();
    const idEstatus: boolean = this.formularioAlumno.value.idEstatus;

    if (this.datosAlumno == null) {
      // GUARDAR

      this._alumnoServicio.guardarAlumno(nombre, aPaterno, aMaterno, fecNaci).subscribe({
        next: (data) => {
          if (data.status == "00") {
            Swal.fire({
              icon: 'success',
              title: 'Alumno Guardado',
              text: data.value[1]
            })
            this.modalActual.close("true")
          }
          else {

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "warning",
              title: data.msg
            });



          }
        }
      });

    }
    else {
      // EDITAR
      const matricula: number = this.datosAlumno.matricula;

      this._alumnoServicio.modificarAlumno(matricula, nombre, aPaterno, aMaterno, fecNaci, idEstatus).subscribe({
        next: (data) => {
          if (data.status == "00") {
            Swal.fire({
              icon: 'success',
              title: 'Alumno Modificado',
              text: data.value[1]
            })

            this.modalActual.close("true")

          }
          else {

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "warning",
              title: data.msg
            });
          }

        }
      })
    }


  }


}
