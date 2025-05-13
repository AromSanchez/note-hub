import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = false;
  
  showTaskModal: boolean = false;
  showDeleteModal: boolean = false;
  
  currentTask: Task | null = null;
  taskToDelete: string | null = null;
  
  // Subject para gestionar la limpieza de suscripciones
  private destroy$ = new Subject<void>();
  
  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    // Suscribirse a cambios en las tareas
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.applyFilter();
      });
    
    // Suscribirse al estado de carga
    this.taskService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
    
    // Suscribirse a errores
    this.taskService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.notificationService.showNotification(error, 'error');
        }
      });
  }
  
  ngOnDestroy(): void {
    // Limpiar todas las suscripciones cuando el componente se destruya
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  applyFilter(): void {
    this.filteredTasks = this.tasks.filter(task => {
      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'pendiente') return task.estado === 'pendiente';
      if (this.activeFilter === 'completado') return task.estado === 'completado';
      if (this.activeFilter === 'cercanas') {
        const today = new Date();
        const deadline = new Date(task.fecha_limite);
        const diffTime = Math.abs(deadline.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && task.estado === 'pendiente';
      }
      return true;
    });
  }
  
  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }
  
  toggleTaskStatus(id: string): void {
    this.taskService.toggleTaskStatus(id)
      .subscribe({
        error: (error) => {
          this.notificationService.showNotification('Error al cambiar estado: ' + error.message, 'error');
        }
      });
  }
  
  openNewTaskModal(): void {
    this.currentTask = {
      titulo: '',
      descripcion: '',
      fecha_limite: new Date(),
      materia: '',
      estado: 'pendiente'
    };
    this.showTaskModal = true;
  }
  
  openEditTaskModal(task: Task): void {
    this.currentTask = { ...task };
    this.showTaskModal = true;
  }
  
  confirmDelete(id: string): void {
    this.taskToDelete = id;
    this.showDeleteModal = true;
  }
  
  deleteTask(): void {
    if (this.taskToDelete) {
      const taskName = this.tasks.find(task => task._id === this.taskToDelete)?.titulo || 'Tarea';
      
      this.taskService.deleteTask(this.taskToDelete)
        .subscribe({
          next: () => {
            this.notificationService.showNotification(`"${taskName}" ha sido eliminada con éxito`);
            this.showDeleteModal = false;
            this.taskToDelete = null;
          },
          error: (error) => {
            this.notificationService.showNotification('Error al eliminar: ' + error.message, 'error');
          }
        });
    }
  }
  
  saveTask(task: Task): void {
    if (task._id) {
      this.taskService.updateTask(task)
        .subscribe({
          next: () => {
            this.notificationService.showNotification(`"${task.titulo}" ha sido actualizada`);
            this.showTaskModal = false;
          },
          error: (error) => {
            this.notificationService.showNotification('Error al actualizar: ' + error.message, 'error');
          }
        });
    } else {
      this.taskService.addTask(task)
        .subscribe({
          next: () => {
            this.notificationService.showNotification(`"${task.titulo}" ha sido creada`);
            this.showTaskModal = false;
          },
          error: (error) => {
            this.notificationService.showNotification('Error al crear: ' + error.message, 'error');
          }
        });
    }
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  getDaysRemaining(deadline: Date): string {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `${diffDays} días`;
  }
  
  getPriorityClass(deadline: Date): string {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'bg-red-100 text-red-800';
    if (diffDays <= 3) return 'bg-orange-100 text-orange-800';
    if (diffDays <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }
}