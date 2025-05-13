import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'
import { TaskViewComponent } from './components/task-view/task-view.component';
import { TaskSummaryComponent } from './components/task-summary/task-summary.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, TaskViewComponent, TaskSummaryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
