import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private supabaseService: SupabaseService) {}

  async getTodos(): Promise<Todo[]> {
    return this.supabaseService.executeWithRetry(async (client) => {
      const { data, error } = await client
        .from('todos')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    });
  }

  async addTodo(todo: Todo): Promise<Todo> {
    return this.supabaseService.executeWithRetry(async (client) => {
      const { data, error } = await client
        .from('todos')
        .insert(todo)
        .single();

      if (error) {
        if (error.code === '42501') {
          throw new Error('Permission denied: Unable to add todo due to security policy.');
        }
        throw error;
      }
      return data;
    });
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    return this.supabaseService.executeWithRetry(async (client) => {
      const { data, error } = await client
        .from('todos')
        .update({ title: todo.title, completed: todo.completed })
        .eq('id', todo.id)
        .single();

      if (error) throw error;
      return data;
    });
  }

  async deleteTodo(id: number): Promise<void> {
    return this.supabaseService.executeWithRetry(async (client) => {
      const { error } = await client
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    });
  }
}