import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.initSupabase();
  }

  private initSupabase() {
    try {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
    }
  }

  async ensureInitialized(retries = 3): Promise<SupabaseClient> {
    if (this.supabase) {
      return this.supabase;
    }

    if (retries > 0) {
      console.log(`Attempting to initialize Supabase client... (${retries} attempts left)`);
      this.initSupabase();
      if (this.supabase) {
        return this.supabase;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.ensureInitialized(retries - 1);
    }

    throw new Error('Failed to initialize Supabase client after multiple attempts');
  }

  async executeWithRetry<T>(operation: (client: SupabaseClient) => Promise<T>, retries = 3): Promise<T> {
    try {
      const client = await this.ensureInitialized();
      return await operation(client);
    } catch (error) {
      if (retries > 0) {
        console.log(`Operation failed. Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.executeWithRetry(operation, retries - 1);
      }
      throw error;
    }
  }
}