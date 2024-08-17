import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  errorMessage = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  async loadTodos(): Promise<void> {
    try {
      this.todos = await this.todoService.getTodos();
      this.errorMessage = ''; // Clear any previous error message
    } catch (error) {
      console.error('Error loading todos:', error);
      this.errorMessage = 'Unable to load todos. Please try again later.';
    }
  }

  async addTodo(): Promise<void> {
    if (this.newTodoTitle.trim()) {
      try {
        const newTodo: Todo = {
          title: this.newTodoTitle.trim(),
          completed: false
        };
        await this.todoService.addTodo(newTodo);
        this.newTodoTitle = '';
        await this.loadTodos(); // Reload todos after adding
        this.errorMessage = ''; // Clear any previous error message
      } catch (error) {
        console.error('Error adding todo:', error);
        this.errorMessage = 'Unable to add todo. Please try again.';
      }
    }
  }

  async toggleTodo(todo: Todo): Promise<void> {
    try {
      todo.completed = !todo.completed;
      await this.todoService.updateTodo(todo);
      this.errorMessage = ''; // Clear any previous error message
    } catch (error) {
      console.error('Error updating todo:', error);
      this.errorMessage = 'Unable to update todo. Please try again.';
    }
  }

  async deleteTodo(id: number | undefined): Promise<void> {
    if (id !== undefined) {
      try {
        await this.todoService.deleteTodo(id);
        await this.loadTodos(); // Reload todos after deleting
        this.errorMessage = ''; // Clear any previous error message
      } catch (error) {
        console.error('Error deleting todo:', error);
        this.errorMessage = 'Unable to delete todo. Please try again.';
      }
    }
  }
}
