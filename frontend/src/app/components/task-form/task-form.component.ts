import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();
  
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.resetForm();
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      _id: [null],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_limite: [new Date(), [Validators.required, this.futureDateValidator]],
      materia: ['', Validators.required],
      estado: ['pendiente', Validators.required]
    });
  }
  
  resetForm(): void {
    if (this.task) {
      // Formatear la fecha para el input date de HTML
      const fechaLimite = this.task.fecha_limite instanceof Date 
        ? this.task.fecha_limite 
        : new Date(this.task.fecha_limite);
        
      this.taskForm.patchValue({
        _id: this.task._id,
        titulo: this.task.titulo,
        descripcion: this.task.descripcion,
        fecha_limite: fechaLimite.toISOString().split('T')[0],
        materia: this.task.materia,
        estado: this.task.estado
      });
    } else {
      this.taskForm.reset({
        estado: 'pendiente',
        fecha_limite: new Date().toISOString().split('T')[0]
      });
    }
  }
  
  futureDateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today ? null : { pastDate: true };
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      // Asegurarse de que la fecha es un objeto Date
      const taskData: Task = {
        ...formValue,
        fecha_limite: new Date(formValue.fecha_limite)
      };
      
      this.save.emit(taskData);
      this.taskForm.reset({
        estado: 'pendiente',
        fecha_limite: new Date().toISOString().split('T')[0]
      });
    }
  }
}

// src/app/components/confirm-dialog/confirm-dialog.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() show: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}