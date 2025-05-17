import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  _id?: string;
  titulo: string;
  descripcion: string;
  fecha_limite: Date;
  materia: string;
  estado: 'pendiente' | 'completado';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskStats {
  total: number;
  pendientes: number;
  completadas: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tareas/';

  constructor(private http: HttpClient) {}

  getStats(): Observable<TaskStats> {
    return this.http.get<{ stats: TaskStats }>(this.apiUrl)
      .pipe(map(response => response.stats));
  }

  getAllTareas(): Observable<Task[]> {
    return this.http.get<{ tareas: Task[] }>(this.apiUrl)
      .pipe(map(response => response.tareas));
  }

  deleteTarea(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + id);
  }

  agregarTarea(tarea: Task): Observable<any> {
    return this.http.post(this.apiUrl, tarea);
  }
}
