import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', component: TodoListComponent },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
              RouterOutlet,
              RouterModule,
              FormsModule,
              TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   title = 'todo-list-app';
}
