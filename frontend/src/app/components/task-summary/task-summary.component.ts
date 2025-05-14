import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule aquí

import { TaskService, TaskStats } from '../../services/task.service';

@Component({
  selector: 'app-task-summary',
  standalone: true,  // Asegúrate de que tu componente sea standalone
  imports: [CommonModule],  // Añades CommonModule para poder usar el pipe json
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.css']
})
export class TaskSummaryComponent implements OnInit {

  stats: TaskStats = { total: 0, pendientes: 0, completadas: 0 }; // Inicialización de las variables para las estadísticas
  tareas: any[] = [];  // Puedes luego tiparlo mejor si defines una interfaz Task

  constructor(private taskService: TaskService) { } // Inyección del servicio TaskService

  ngOnInit(): void {
    this.taskService.getStats().subscribe({
      next: (data) => {
        this.stats = data;  // Aquí ya debería ser directamente `stats`
      },
      error: (err) => {
        console.error('Error al obtener estadísticas', err);
      }
    });
    
    this.taskService.getAllTareas().subscribe({
      next: (data) => this.tareas = data,
      error: (err) => console.error('Error al obtener tareas', err)
    });
  }
}