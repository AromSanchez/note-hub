// task.service.ts corregido
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Task } from '../components/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // URL base de tu API 
  private apiUrl = 'http://localhost:8000/api/tareas';
  
  // BehaviorSubject para mantener el estado actual de las tareas
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Observables públicos que los componentes pueden suscribir
  tasks$ = this.tasksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Cargar tareas al inicializar el servicio
    this.loadTasks();
  }
  
  // Obtener todas las tareas del backend
  loadTasks(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.map(task => ({
          ...task,
          fecha_limite: new Date(task.fecha_limite) // Convertir string a Date
        }))),
        tap(tasks => {
          this.tasksSubject.next(tasks);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }
  
  // Crear una nueva tarea
  addTask(task: Task): Observable<Task> {
    this.loadingSubject.next(true);
    
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(
        map(newTask => ({
          ...newTask,
          fecha_limite: new Date(newTask.fecha_limite)
        })),
        tap(newTask => {
          const currentTasks = this.tasksSubject.value;
          this.tasksSubject.next([...currentTasks, newTask]);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }
  
  // Actualizar una tarea existente
  updateTask(task: Task): Observable<Task> {
    this.loadingSubject.next(true);
    
    return this.http.put<Task>(`${this.apiUrl}/${task._id}`, task)
      .pipe(
        map(updatedTask => ({
          ...updatedTask,
          fecha_limite: new Date(updatedTask.fecha_limite)
        })),
        tap(updatedTask => {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.map(t => 
            t._id === updatedTask._id ? updatedTask : t
          );
          this.tasksSubject.next(updatedTasks);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }
  
  // Eliminar una tarea
  deleteTask(id: string): Observable<any> {
    this.loadingSubject.next(true);
    
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.filter(task => task._id !== id);
          this.tasksSubject.next(updatedTasks);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }
  
  // Cambiar el estado de una tarea
  toggleTaskStatus(id: string): Observable<Task> {
    this.loadingSubject.next(true);
    
    // Primero encontramos la tarea actual para conocer su estado
    const task = this.tasksSubject.value.find(t => t._id === id);
    
    if (!task) {
      return throwError(() => new Error('Tarea no encontrada'));
    }
    
    // Invertimos el estado
    const newStatus = task.estado === 'pendiente' ? 'completado' : 'pendiente';
    
    // Enviamos solo el cambio de estado (patch parcial)
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, { estado: newStatus })
      .pipe(
        map(updatedTask => ({
          ...updatedTask,
          fecha_limite: new Date(updatedTask.fecha_limite)
        })),
        tap(updatedTask => {
          const currentTasks = this.tasksSubject.value;
          const updatedTasks = currentTasks.map(t => 
            t._id === updatedTask._id ? updatedTask : t
          );
          this.tasksSubject.next(updatedTasks);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }
  
  // Manejador de errores centralizado
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ocurrió un error en el servidor.';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del backend
      errorMessage = `Error ${error.status}: ${error.error.message || error.statusText}`;
    }
    
    this.errorSubject.next(errorMessage);
    this.loadingSubject.next(false);
    return throwError(() => new Error(errorMessage));
  }
}