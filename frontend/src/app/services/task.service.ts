  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';  // Import the map operator

  export interface TaskStats {
    total: number;
    pendientes: number;
    completadas: number;
  }

  @Injectable({
    providedIn: 'root'
  })
  export class TaskService {
    private apiUrl = 'http://localhost:8000/api/tareas'; //ps esto es el puerto

    constructor(private http: HttpClient) {}

    getStats(): Observable<TaskStats> {
      return this.http.get<{ stats: TaskStats }>(this.apiUrl)
        .pipe(
          map(response => response.stats)  // Extraemos solo la propiedad `stats`
        );
    }
    
    getAllTareas(): Observable<any[]> {
      return this.http.get<{ tareas: any[] }>(this.apiUrl).pipe(
        map(response => response.tareas)
      );
    }
  }
