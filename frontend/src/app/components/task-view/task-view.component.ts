import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  tareas: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllTareas().subscribe({
      next: (data) => this.tareas = data,
      error: (err) => console.error('Error al obtener tareas', err)
    });
  }

  eliminarTarea(id: string) {
  if (!id) {
    console.error('ID de tarea inválido:', id);
    return;
  }

  this.taskService.deleteTarea(id).subscribe({
    next: () => {
      console.log('Tarea eliminada:', id);
      this.ngOnInit(); // Recarga las tareas
    },
    error: (err) => {
      console.error('Error al eliminar tarea:', err);
    }
  });
}

}