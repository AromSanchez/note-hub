import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  tareaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _taskservice: TaskService
  ) {
    this.tareaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_limite: ['', Validators.required],
      materia: ['', Validators.required],
      estado: ['pendiente', Validators.required],
    });
  }

  ngOnInit(): void {}

  agregarTarea() {
    if (this.tareaForm.valid) {
      const nuevaTarea: Task = this.tareaForm.value;

      this._taskservice.agregarTarea(nuevaTarea).subscribe({
        next: res => {
          console.log('Tarea agregada con éxito:', res);
          this.tareaForm.reset({ estado: 'pendiente' });
          // Opcional: cerrar modal con JS o recargar tareas
        },
        error: err => {
          console.error('Error al agregar tarea:', err);
        }
      });
    } else {
      Object.keys(this.tareaForm.controls).forEach(key => {
        this.tareaForm.get(key)?.markAsTouched();
      });
    }
  }
}