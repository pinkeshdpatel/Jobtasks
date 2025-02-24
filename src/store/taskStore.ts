import { create } from 'zustand';
import { Task } from '../types/task';
import { supabase } from '../lib/supabase';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  loadTasks: () => Promise<void>;
}

const transformDatabaseTask = (dbTask: any): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description,
  priority: dbTask.priority,
  category: dbTask.category,
  status: dbTask.status,
  deadline: dbTask.deadline,
  timeSpent: dbTask.time_spent,
  progress: dbTask.progress,
  attachments: Array.isArray(dbTask.attachments) ? dbTask.attachments : [],
  createdAt: dbTask.created_at,
  updatedAt: dbTask.updated_at
});

const transformToDatabase = (task: Partial<Task>) => ({
  ...(task.title !== undefined && { title: task.title }),
  ...(task.description !== undefined && { description: task.description }),
  ...(task.priority !== undefined && { priority: task.priority }),
  ...(task.category !== undefined && { category: task.category }),
  ...(task.status !== undefined && { status: task.status }),
  ...(task.deadline !== undefined && { deadline: task.deadline }),
  ...(task.timeSpent !== undefined && { time_spent: task.timeSpent }),
  ...(task.progress !== undefined && { progress: task.progress }),
  ...(task.attachments !== undefined && { attachments: task.attachments })
});

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],

  loadTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    const transformedTasks = (data || []).map(transformDatabaseTask);
    set({ tasks: transformedTasks });
  },

  addTask: async (taskData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...transformToDatabase(taskData),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    if (data) {
      const transformedTask = transformDatabaseTask(data);
      set({ tasks: [transformedTask, ...get().tasks] });
    }
  },

  updateTask: async (id, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(transformToDatabase(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    if (data) {
      const transformedTask = transformDatabaseTask(data);
      set({ tasks: get().tasks.map(t => t.id === id ? transformedTask : t) });
    }
  },

  deleteTask: async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return;
    }

    set({ tasks: get().tasks.filter(t => t.id !== id) });
  },
}));