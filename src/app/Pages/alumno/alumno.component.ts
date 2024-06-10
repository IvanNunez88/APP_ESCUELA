import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
// 
import { MatCardModule } from '@angular/material/card'; //TARJETAS
import { MatTooltipModule } from '@angular/material/tooltip'; //ALERTAS EN OBJETOS
import { MatDialogModule } from '@angular/material/dialog'; //MODALES
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; //MANEJO DE TABLAS
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; //PAGINADOS DE PAGINAS
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';

// 
import { iAlumno } from '../../Models/i-alumno';
import { AlumnoService } from '../../Services/alumno.service';
import { MatDialog } from '@angular/material/dialog';

import { ModalAlumnoComponent } from './Modals/modal-alumno/modal-alumno.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [MatCardModule, MatLabel, MatFormFieldModule, MatInputModule, MatTooltipModule, MatDialogModule, MatDividerModule, MatListModule, MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './alumno.component.html',
  styleUrl: './alumno.component.css'
})
export class AlumnoComponent implements OnInit, AfterViewInit {

  listaAlumno: iAlumno[] = [];
  columnasTabla: string[] = ["matricula", "alumno", "estatus", "fecNaci", "accion"];
  dataListadoAlumno = new MatTableDataSource<iAlumno>();
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private _alumnoServicio: AlumnoService,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.cargarInfo();
  }

  ngAfterViewInit(): void {
    this.dataListadoAlumno.paginator = this.paginacionTabla;
    this.dataListadoAlumno.sort = this.sort;
  }

  async aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListadoAlumno.filter = filterValue.trim().toLocaleLowerCase();
  }

  cargarInfo() {
    this._alumnoServicio.listaAlumno().subscribe({
      next: (data: any) => {
        if (data.status == "00") {
          this.dataListadoAlumno.data = data.value;
        }
        else {
          this.dataListadoAlumno.data = [];
        }
      }
    })
  }

  nuevoAlumno() {
    this.dialog.open(ModalAlumnoComponent, {
      height: "515px",
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.cargarInfo();
      }
    });
  }

  editarAlumno(alumno: iAlumno) {
    this.dialog.open(ModalAlumnoComponent, {
      height: "610px",
      data: alumno,
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.cargarInfo();
      }
    });
  }

  borrarAlumno(alumno: iAlumno) {
    Swal.fire({
      title: '¿Deseas borrar al alumno?',
      text: alumno.nombre + " " + alumno.aPaterno + " " + alumno.aMaterno,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: 'd33',
      cancelButtonText: 'No, volver'
    }).then(resultado => {
      if (resultado.isConfirmed) {


        this._alumnoServicio.borrarAlumno(alumno.matricula).subscribe({
          next: async (data) => {
            if (data.status == "00") {
              Swal.fire({
                icon: 'success',
                title: 'Alumno Eliminado',
                text: data.value[1]
              })
              this.cargarInfo();

            }
          }
        })
      }
    });
  }

}
